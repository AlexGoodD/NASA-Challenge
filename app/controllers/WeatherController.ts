import type { HttpContext } from '@adonisjs/core/http'
import { getWeatherValidator } from '#validators/weather'

export default class WeatherController {
  public async index({ inertia, request }: HttpContext) {
    const payload = request.validateUsing(getWeatherValidator)

    const weatherInformation = {}

    return inertia.render('Dashboard')
  }
}
