import type { HttpContext } from '@adonisjs/core/http'
import { predictWeatherViabilityValidator } from '#validators/weather'
import GeminiService from '../../services/GeminiService.js'
import env from '#start/env'

export default class WeatherController {
  public async index({ inertia }: HttpContext) {
    return inertia.render('Dashboard')
  }

  private readonly apiKey: string = env.get('OPEN_WEATHER_API_KEY')
  private readonly weatherApiBaseUrl = 'https://api.openweathermap.org/data/3.0/onecall'

  public async search({ request, response }: HttpContext) {
    const { latitude, longitude } = request.body()

    const params = new URLSearchParams({
      lat: latitude,
      lon: longitude,
      appid: this.apiKey,
      units: 'metric',
    })

    console.log(`${this.weatherApiBaseUrl}?${params}`)
    const owResponse = await fetch(`${this.weatherApiBaseUrl}?${params}`)
    if (!owResponse.ok) {
      console.log(owResponse)
      console.error('Failed to fetch weather data:', owResponse.statusText)
      return response.status(owResponse.status).json({ error: 'Failed to fetch weather data' })
    }

    const apiData = (await owResponse.json()) as any

    // Transform API data into our clean structure
    const weatherData: WeatherData = {
      current: {
        timestamp: new Date(apiData.current.dt * 1000),
        temperature: apiData.current.temp,
        feelsLike: apiData.current.feels_like,
        pressure: apiData.current.pressure,
        humidity: apiData.current.humidity,
        uvi: apiData.current.uvi,
        visibility: apiData.current.visibility,
        windSpeed: apiData.current.wind_speed,
        weather: {
          main: apiData.current.weather[0].main,
          description: apiData.current.weather[0].description,
          icon: apiData.current.weather[0].icon,
        },
      },
      daily: {
        date: new Date(apiData.daily[0].dt * 1000),
        sunrise: new Date(apiData.daily[0].sunrise * 1000),
        sunset: new Date(apiData.daily[0].sunset * 1000),
        summary: apiData.daily[0].summary,
        maxTemperature: apiData.daily[0].temp.max,
        minTemperature: apiData.daily[0].temp.min,
        precipitationProbability: apiData.daily[0].pop * 100,
        dewPoint: apiData.daily[0].dew_point,
      },
      hourly: apiData.hourly.slice(0, 24).map((hour: any) => ({
        timestamp: new Date(hour.dt * 1000),
        temperature: hour.temp,
        precipitationProbability: hour.pop * 100,
        windSpeed: hour.wind_speed,
        uvi: hour.uvi,
        humidity: hour.humidity,
        weather: {
          main: hour.weather[0].main,
          icon: hour.weather[0].icon,
        },
      })),
    }

    console.log(weatherData)

    return weatherData
  }

  public async predictViability({ request }: HttpContext) {
    const { weatherInformation, userPlan, date, placeName } = await request.validateUsing(
      predictWeatherViabilityValidator
    )

    const geminiService = new GeminiService()

    return await geminiService.ask(JSON.stringify(weatherInformation), userPlan, placeName, date)
  }
}

export interface WeatherData {
  current: CurrentWeather
  daily: DailyForecast // Only today's forecast
  hourly: HourlyForecast[] // Next 24 hours
}

export interface CurrentWeather {
  timestamp: Date
  temperature: number
  feelsLike: number
  pressure: number
  humidity: number
  uvi: number
  visibility: number
  windSpeed: number
  weather: {
    main: string
    description: string
    icon: string
  }
}

export interface DailyForecast {
  date: Date
  sunrise: Date
  sunset: Date
  summary: string
  maxTemperature: number
  minTemperature: number
  precipitationProbability: number
  dewPoint: number
}

export interface HourlyForecast {
  timestamp: Date
  temp: number
  precipitationProbability: number
  windSpeed: number
  humidity: number
  uvi: number
  weather: {
    main: string
    icon: string
  }
}
