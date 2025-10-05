import type { HttpContext } from '@adonisjs/core/http'
import { getWeatherValidator, predictWeatherViabilityValidator } from '#validators/weather'
import { fetchWeatherApi } from 'openmeteo'
import GeminiService from '../../services/GeminiService.js'
import env from '#start/env'

export default class WeatherController {
  public async index({ inertia, request }: HttpContext) {
    const payload = request.validateUsing(getWeatherValidator)
    const weatherInformation = {}

    return inertia.render('Dashboard')
  }

  public async search({ request, response }: HttpContext) {
    try {
      const { latitude, longitude } = request.body()
      const apiKey = env.get('MAPS_API_KEY')

      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      const geoResponse = await fetch(geoUrl)
      const geoData = (await geoResponse.json()) as any

      if (geoData.status !== 'OK' || !geoData.results?.[0]) {
        throw new Error(
          `Geocoding failed: ${geoData.status} - ${geoData.error_message || 'No results found.'}`
        )
      }

      const result = geoData.results[0]
      const localityComponent = result.address_components.find((c: any) =>
        c.types.includes('locality')
      )
      const cityName = localityComponent?.long_name ?? result.formatted_address

      const weatherParams = {
        latitude: Number(latitude),
        longitude: Number(longitude),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'weather_code',
          'wind_speed_10m',
          'precipitation_probability',
          'dew_point_2m',
          'surface_pressure',
        ],
        timezone: 'auto',
        forecast_days: 1, // Only need 1 day for current data
      }

      const url = 'https://api.open-meteo.com/v1/forecast'
      const responses = await fetchWeatherApi(url, weatherParams)
      const apiResponse = responses[0]

      const utcOffsetSeconds = apiResponse.utcOffsetSeconds()
      const current = apiResponse.current()

      if (!current) {
        throw new Error('API response is missing current weather data.')
      }

      const createVariableMapper = (requestedParams: string[]) => (apiSection: any) => {
        const map = new Map<string, any>()
        for (let i = 0; i < requestedParams.length; i++) {
          const variableName = requestedParams[i]
          const variableData = apiSection.variables(i)
          if (variableData) {
            map.set(variableName, variableData)
          }
        }
        return map
      }

      const currentVarMap = createVariableMapper(weatherParams.current)(current)

      const currentData = {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000).toISOString(),
        temperature: currentVarMap.get('temperature_2m')?.value(),
        humidity: currentVarMap.get('relative_humidity_2m')?.value(),
        feelsLike: currentVarMap.get('apparent_temperature')?.value(),
        weatherCode: currentVarMap.get('weather_code')?.value(),
        windSpeed: currentVarMap.get('wind_speed_10m')?.value(),
        precipitationProbability: currentVarMap.get('precipitation_probability')?.value(),
        dewPoint: currentVarMap.get('dew_point_2m')?.value(),
        pressure: currentVarMap.get('surface_pressure')?.value(),
      }

      if (Object.values(currentData).some((v) => v === undefined)) {
        throw new Error('Failed to parse essential current weather data.')
      }

      return response.ok({
        location: { city: cityName, latitude: Number(latitude), longitude: Number(longitude) },
        current: currentData,
      })
    } catch (error) {
      console.error('Error in search controller:', error)
      const message = error instanceof Error ? error.message : 'An unknown error occurred.'
      return response.status(500).send({ message })
    }
  }

  public async predictViability({ request }: HttpContext) {
    const { weatherInformation, userPlan, date, placeName } = await request.validateUsing(
      predictWeatherViabilityValidator
    )

    const geminiService = new GeminiService()

    return await geminiService.ask(JSON.stringify(weatherInformation), userPlan, placeName, date)
  }
}

export interface LocationData {
  city: string
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  time: string
  temperature: number
  humidity: number
  feelsLike: number
  weatherCode: number
  windSpeed: number
  precipitationProbability: number
  dewPoint: number
  dailyMaxTemp: number
  dailyMinTemp: number
  pressure: number
  sunrise: string
  sunset: string
}

export interface HourlyForecast {
  time: string
  temperature: number
  weatherCode: number
}

export interface DailyForecast {
  date: string
  weatherCode: number
  maxTemp: number
  minTemp: number
}

export interface WeatherData {
  location: LocationData
  current: CurrentWeather
}
