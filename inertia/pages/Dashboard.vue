<script setup lang="ts">
import Card from '~/components/UI/Card.vue'
import ProbabilityChart from '~/components/Dashboard/ProbabilityChart.vue'
import TrendGraph from '~/components/Dashboard/TrendGraph.vue'
import WeatherCard from '~/components/Dashboard/WeatherCard.vue'
import MapSelector from '~/components/Map/MapSelector.vue'
import UvIndex from '~/components/Dashboard/UVIndex.vue'
import Humidity from '~/components/Dashboard/Humidity.vue'
import Visibility from '~/components/Dashboard/Visibility.vue'
import AutocompletableSearch from '~/components/AutocompletableSearch.vue'
import { onMounted, ref, watch } from 'vue'
import { PlacesApiResponse } from '../../services/GoogleMapsService'
import axios from 'axios'
import Pressure from '~/components/Dashboard/Pressure.vue'
import HeatIndex from '~/components/Dashboard/HeatIndex.vue'
import AiPredictor from '~/components/AiPredictor.vue'
import { WeatherData } from '#controllers/WeatherController'
import DatePicker from '~/components/DatePicker.vue'

const place = ref<PlacesApiResponse['places'][number]>()
const latitud = ref<number | null>(null)
const longitud = ref<number | null>(null)
const weatherData = ref<WeatherData>()
const locationPermissionGranted = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const city = ref<string>('Cargando...')
const country = ref<string>('')

const fetchWeatherData = async (lat: number, lon: number) => {
  try {
    isLoading.value = true
    const response = await axios.post('/retrieve-data', {
      latitude: lat,
      longitude: lon,
    })
    weatherData.value = response.data as WeatherData
    console.log('Weather data received:', response.data)
  } catch (error) {
    console.error('Error fetching weather data:', error)
  } finally {
    isLoading.value = false
  }
}

async function getApproximateLocation() {
  const ipResponse = await axios.get('https://api.ipify.org?format=json')
  const ip = ipResponse.data.ip

  // Using ipinfo.io instead of ip-api.com
  // Note: For production, you should sign up for a free API token.
  const geoResponse = await axios.get(`https://ipinfo.io/${ip}/json`)

  // ipinfo.io returns location in a "loc" string like "lat,lon"
  const [latitude, longitude] = geoResponse.data.loc.split(',').map(Number)

  await fetchWeatherData(latitude, longitude)
}

function requestLocationPermission() {
  if (!navigator.geolocation) {
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      latitud.value = position.coords.latitude
      longitud.value = position.coords.longitude
      locationPermissionGranted.value = true
      await fetchWeatherData(position.coords.latitude, position.coords.longitude)
    },
    async (error: GeolocationPositionError) => {
      locationPermissionGranted.value = false
      await getApproximateLocation()
      console.error('Error getting location:', error)
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  )
}

watch(place, (newPlace) => {
  if (newPlace && newPlace.location) {
    const lat = newPlace.location.latitude
    const lon = newPlace.location.longitude
    latitud.value = lat
    longitud.value = lon
    fetchWeatherData(lat, lon)
  }
})

onMounted(() => {
  requestLocationPermission()
})

/**
 * [
 *   {
 *     "timestamp": "2025-10-05T05:00:00.000Z",
 *     "temp": 22.07,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clouds",
 *       "icon": "03n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T06:00:00.000Z",
 *     "temp": 22.02,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clouds",
 *       "icon": "03n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T07:00:00.000Z",
 *     "temp": 21.7,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clouds",
 *       "icon": "02n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T08:00:00.000Z",
 *     "temp": 21.45,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clouds",
 *       "icon": "02n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T09:00:00.000Z",
 *     "temp": 21.22,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clear",
 *       "icon": "01n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T10:00:00.000Z",
 *     "temp": 21.14,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clear",
 *       "icon": "01n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T11:00:00.000Z",
 *     "temp": 19.7,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clear",
 *       "icon": "01n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T12:00:00.000Z",
 *     "temp": 19.5,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clear",
 *       "icon": "01n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T13:00:00.000Z",
 *     "temp": 20.64,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clear",
 *       "icon": "01d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T14:00:00.000Z",
 *     "temp": 22.14,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clear",
 *       "icon": "01d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T15:00:00.000Z",
 *     "temp": 23.71,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clear",
 *       "icon": "01d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T16:00:00.000Z",
 *     "temp": 24.82,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clear",
 *       "icon": "01d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T17:00:00.000Z",
 *     "temp": 26.36,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clear",
 *       "icon": "01d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T18:00:00.000Z",
 *     "temp": 30.2,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clear",
 *       "icon": "01d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T19:00:00.000Z",
 *     "temp": 29.61,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clouds",
 *       "icon": "02d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T20:00:00.000Z",
 *     "temp": 29.84,
 *     "precipitationProbability": 2,
 *     "weather": {
 *       "main": "Clouds",
 *       "icon": "02d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T21:00:00.000Z",
 *     "temp": 29.54,
 *     "precipitationProbability": 28.000000000000004,
 *     "weather": {
 *       "main": "Rain",
 *       "icon": "10d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T22:00:00.000Z",
 *     "temp": 29.22,
 *     "precipitationProbability": 39,
 *     "weather": {
 *       "main": "Rain",
 *       "icon": "10d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-05T23:00:00.000Z",
 *     "temp": 28.62,
 *     "precipitationProbability": 42,
 *     "weather": {
 *       "main": "Rain",
 *       "icon": "10d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-06T00:00:00.000Z",
 *     "temp": 27.36,
 *     "precipitationProbability": 39,
 *     "weather": {
 *       "main": "Rain",
 *       "icon": "10d"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-06T01:00:00.000Z",
 *     "temp": 26.16,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clouds",
 *       "icon": "03n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-06T02:00:00.000Z",
 *     "temp": 25.5,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clouds",
 *       "icon": "03n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-06T03:00:00.000Z",
 *     "temp": 24.77,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clouds",
 *       "icon": "03n"
 *     }
 *   },
 *   {
 *     "timestamp": "2025-10-06T04:00:00.000Z",
 *     "temp": 24.91,
 *     "precipitationProbability": 0,
 *     "weather": {
 *       "main": "Clouds",
 *       "icon": "03n"
 *     }
 *   }
 * ]
 */
function getHourlyPrecipitationProbabilityRecord(): Record<number, number> {
  const record: Record<number, number> = {}
  if (!weatherData.value?.hourly) return record

  weatherData.value.hourly.forEach((entry) => {
    const date = new Date(entry.timestamp)
    const hour = date.getHours()
    record[hour] = entry.precipitationProbability
  })

  return record
}
</script>

<template>
  <div class="dashboard">
    <header class="mb-10 mt-5 flex items-center justify-between">
      <div class="flex gap-2 items-center">
        <MapPin :size="20" />
        <!--Ciudad/Pais-->
        <p>{{ city }}, {{ country }}</p>
      </div>
      <AutocompletableSearch v-model="place" />
      <div class="flex gap-2">
        <DatePicker />
      </div>
    </header>
    <div class="grid grid-cols-4 gap-4" v-if="weatherData">
      <div class="grid col-span-3 grid-cols-3 gap-4 *:max-h-70">
        <WeatherCard class="col-span-2" :weather="weatherData" />
        <ProbabilityChart
          v-if="weatherData?.hourly"
          :hourly-data="getHourlyPrecipitationProbabilityRecord"
        />
        <Card v-else />
        <Card title="Wind Status">
          <TrendGraph
            v-if="weatherData?.hourly.wind_speed_10m"
            :hourly-data="weatherData.hourly.wind_speed_10m"
          />
        </Card>
        <Card title="UV Index" class="min-h-[221px]">
          <UvIndex
            v-if="weatherData?.daily.uv_index_clear_sky_max && weatherData?.daily.uv_index_max"
            :daily-data="{
              uv_index_max: weatherData.daily.uv_index_max,
              uv_index_clear_sky_max: weatherData.daily.uv_index_clear_sky_max,
            }"
          />
        </Card>
        <MapSelector
          :place-name="place?.displayName?.text || 'Ubicación actual'"
          :latitude="latitud"
          :longitude="longitud"
          class="row-span-3 max-h-max"
        />
        <Card title="Humidity">
          <Humidity
            :hourly-data="weatherData?.hourly.relative_humidity_2m"
            :dew-point="weatherData?.hourly.dew_point_2m?.[0]"
          />
        </Card>
        <Card title="Visibility">
          <Visibility :weather-data="weatherData" />
        </Card>
        <Card title="Pressure">
          <Pressure />
        </Card>
        <Card title="Heat Index">
          <HeatIndex />
        </Card>
      </div>

      <div class="right">
        <Card class="max-h-[80dvh]">
          <AiPredictor />
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  background: #101012;
  color: white;
  min-height: 100vh;
  padding: 1rem;
}
</style>
