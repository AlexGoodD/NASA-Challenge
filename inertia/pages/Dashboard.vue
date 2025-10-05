<script setup lang="ts">
import Card from '~/components/UI/Card.vue'
import ProbabilityChart from '~/components/Dashboard/ProbabilityChart.vue'
import TrendGraph from '~/components/Dashboard/TrendGraph.vue'
import WeatherCard from '~/components/Dashboard/WeatherCard.vue'
import UvIndex from '~/components/Dashboard/UVIndex.vue'
import Humidity from '~/components/Dashboard/Humidity.vue'
import Visibility from '~/components/Dashboard/Visibility.vue'
import AutocompletableSearch from '~/components/AutocompletableSearch.vue'
import { onMounted, ref, watch } from 'vue'
import { PlacesApiResponse } from '../../services/GoogleMapsService'
import axios from 'axios'
import Pressure from '~/components/Dashboard/Pressure.vue'
import HeatIndex from '~/components/Dashboard/HeatIndex.vue'
import { WeatherData } from '#controllers/WeatherController'
import NasaMap from '~/components/Map/NasaMap.vue'
import AiPredictor from '~/components/AiPredictor.vue'

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

  const { city: cityName, country: countryName } = geoResponse.data

  city.value = cityName
  country.value = countryName

  await fetchWeatherData(latitude, longitude)
}

function requestLocationPermission() {
  if (!navigator.geolocation) {
    return
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords
    latitud.value = latitude
    longitud.value = longitude
    locationPermissionGranted.value = true

    // Obtener ciudad y país usando BigDataCloud (API gratuita)
    try {
      const geoResponse = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
      )

      // Asignar ciudad y país (maneja casos sin datos)
      city.value = geoResponse.data.city || geoResponse.data.locality || 'Ubicación desconocida'
      country.value = geoResponse.data.countryName || ''
    } catch (geoError) {
      console.error('Error obteniendo ciudad y país:', geoError)
    }

    await fetchWeatherData(latitude, longitude)
  })
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

function getHourlyPrecipitationProbabilityRecord(weather: WeatherData): Record<number, number> {
  const record: Record<number, number> = {}
  if (!weather.hourly) return record

  weather.hourly.forEach((entry) => {
    const date = new Date(entry.timestamp)
    const hour = date.getHours()
    record[hour] = entry.precipitationProbability
  })

  return record
}

function generateHourlyWindSleepRecord(weather: WeatherData): Record<number, number> {
  const record: Record<number, number> = {}
  if (!weather.hourly) return record

  weather.hourly.forEach((entry) => {
    const date = new Date(entry.timestamp)
    const hour = date.getHours()
    record[hour] = entry.windSpeed
  })
  return record
}

function generateHourlyHumidityRecord(weather: WeatherData): Record<number, number> {
  const record: Record<number, number> = {}
  if (!weather.hourly) return record

  weather.hourly.forEach((entry) => {
    const date = new Date(entry.timestamp)
    const hour = date.getHours()
    record[hour] = entry.humidity
  })
  return record
}

function getMaxValue(data: Record<string, any>[], key: string): number {
  console.log('Calculating max value for key:', key, 'in data:', data)
  console.log(Math.max(...data.map((item) => item[key] || 0)))
  return Math.max(...data.map((item) => item[key] || 0))
}
</script>

<template>
  <div class="dashboard">
    <header class="mb-10 mt-5 flex items-center justify-between">
      <div class="flex gap-2 items-center">
        <MapPin :size="20" />
        <p>{{ city }}, {{ country }}</p>
      </div>
      <div class="flex gap-4">
        <AutocompletableSearch v-model="place" />
        <DatePicker />
      </div>
    </header>
    <div class="grid grid-cols-4 gap-4" v-if="weatherData">
      <div class="grid col-span-3 grid-cols-3 gap-4 *:max-h-70">
        <WeatherCard class="col-span-2" :weather="weatherData" />
        <ProbabilityChart
          v-if="weatherData?.hourly"
          :hourly-data="getHourlyPrecipitationProbabilityRecord(weatherData)"
        />
        <Card v-else />
        <Card title="Velocidad del viento">
          <TrendGraph
            v-if="weatherData?.hourly"
            :hourly-data="generateHourlyWindSleepRecord(weatherData)"
          />
        </Card>
        <Card title="Índice UV">
          <UvIndex
            :uv-index="weatherData?.current.uvi"
            :max-uv-index="getMaxValue(weatherData?.hourly || [], 'uvi')"
          />
        </Card>
        <NasaMap
          :place-name="place?.displayName?.text || 'Ubicación actual'"
          :lat="latitud"
          :lon="longitud"
          :date="new Date('2024-10-04')"
          class="row-span-3"
        />
        <Card title="Humidity">
          <Humidity :weather-data="weatherData" />
        </Card>
        <Card title="Visibilidad">
          <Visibility :visibility="weatherData.current.visibility / 1000" />
        </Card>
        <Card title="Presión">
          <Pressure :pressure="weatherData.current.pressure" />
        </Card>
        <Card title="Índice de calor">
          <HeatIndex
            :temperature="weatherData.current.temperature"
            :humidity="weatherData.current.humidity"
          />
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
