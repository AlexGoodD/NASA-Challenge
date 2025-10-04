import { HttpContext } from '@adonisjs/core/http'
import { searchPlaceValidator } from '#validators/place'
import { GoogleMapsService } from '../../services/GoogleMapsService.js'

export default class PlacesController {
  async autocomplete({ request }: HttpContext) {
    const { q } = await request.validateUsing(searchPlaceValidator)

    if (!q) return { places: [] }

    const places = await GoogleMapsService.searchLocation(q)

    return { places }
  }
}
