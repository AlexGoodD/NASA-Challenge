import type { HttpContext } from '@adonisjs/core/http'
import { getWeatherValidator, predictWeatherViabilityValidator } from '#validators/weather'
import { fetchWeatherApi } from 'openmeteo'
import GeminiService from '../../services/GeminiService.js'
import {getFutureForecast} from '../../services/Predictor.js'
import env from '#start/env'

export default class WeatherController {
  public async index({ inertia, request }: HttpContext) {
    const payload = request.validateUsing(getWeatherValidator)
    const weatherInformation = {}

    return inertia.render('Dashboard')
  }

  public async search({ request }: HttpContext) {
    const { latitude, longitude } = request.body()
    console.log(latitude, longitude)
    const params = {
      latitude: Number(latitude),
      longitude: Number(longitude),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
        'wind_speed_10m_max',
      ],
      hourly: [
        'temperature_2m',
        'wind_speed_10m',
        'relative_humidity_2m',
        'precipitation_probability',
        'apparent_temperature',
        'dew_point_2m',
      ],
      timezone: 'America/Chicago',
      forecast_days: 1,
    }

    const url = 'https://api.open-meteo.com/v1/forecast'
    const responses = await fetchWeatherApi(url, params)
    const response = responses[0]

    const hourly = response.hourly()!
    const daily = response.daily()!
    const utcOffsetSeconds = response.utcOffsetSeconds()

    const weatherData = {
      hourly: {
        time: [
          ...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()),
        ].map(
          (_, i) =>
            new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature_2m: hourly.variables(0)!.valuesArray(),
        wind_speed_10m: hourly.variables(1)!.valuesArray(),
        relative_humidity_2m: hourly.variables(2)!.valuesArray(),
        precipitation_probability: hourly.variables(3)!.valuesArray(),
        apparent_temperature: hourly.variables(4)!.valuesArray(),
        dew_point_2m: hourly.variables(5)!.valuesArray(),
      },
      daily: {
        time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
          (_, i) =>
            new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
        ),
        weather_code: daily.variables(0)!.valuesArray(),
        temperature_2m_max: daily.variables(1)!.valuesArray(),
        temperature_2m_min: daily.variables(2)!.valuesArray(),
        precipitation_probability_max: daily.variables(3)!.valuesArray(),
        wind_speed_10m_max: daily.variables(4)!.valuesArray(),
      },
    }

    return weatherData
  }

  public async predictViability({ request }: HttpContext) {
    try{
      const { lat, lon, userPlan, date, placeName } = await request.validateUsing(
        predictWeatherViabilityValidator
      )

      const geminiService = new GeminiService()
      const forecast: any = await getFutureForecast({lat, lon, date: '2026-01-01'})
      const toCelsius = (k: number) => (k - 273.15).toFixed(1)

      const tempMin = toCelsius(forecast.temperature.min)
      const tempMax = toCelsius(forecast.temperature.max)
      const tempAfternoon = toCelsius(forecast.temperature.afternoon)
      const wind = forecast.wind?.max?.speed ?? 0
      const humidity = forecast.humidity?.afternoon ?? 0
      const clouds = forecast.cloud_cover?.afternoon ?? 0
      const rain = forecast.precipitation?.total ?? 0

      const summarizedForecast = `
        Temperatura mínima: ${tempMin} °C
        Temperatura máxima: ${tempMax} °C
        Temperatura promedio en la tarde: ${tempAfternoon} °C
        Velocidad máxima del viento: ${wind} m/s
        Humedad: ${humidity}%
        Nubosidad: ${clouds}%
        Precipitación total: ${rain} mm
        Presión atmosférica: ${forecast.pressure?.afternoon ?? 0} hPa
      `.trim()

      

      return await geminiService.ask(summarizedForecast, userPlan, placeName, date)
    } catch(error){
      console.log(error)
    }
  }
}
