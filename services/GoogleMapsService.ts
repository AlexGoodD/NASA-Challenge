import axios from 'axios'
import env from '#start/env'

export type PlacesApiResponse = {
  places: {
    id: string
    displayName: { text: string; languageCode: string }
    location: { latitude: number; longitude: number }
    formattedAddress: string
    types: string[]
  }[]
}

const placesApiClient = axios.create({
  baseURL: 'https://places.googleapis.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': env.get('MAPS_API_KEY'),
    'X-Goog-FieldMask':
      'places.types,' +
      'places.id,' +
      'places.displayName,' +
      'places.location,' +
      'places.formattedAddress',
  },
})

export class GoogleMapsService {
  static async searchLocation(query: string): Promise<PlacesApiResponse['places']> {
    const res = await placesApiClient
      .post('/places:searchText', {
        pageSize: 8,
        textQuery: query,
        languageCode: 'es',
      })
      .catch((e) => console.log(e))
    return res?.data.places ?? []
  }
}
