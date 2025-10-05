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
import NasaMap from '~/components/Map/NasaMap.vue'

const place = ref<PlacesApiResponse['places'][number]>()
const latitud = ref<number | null>(null)
const longitud = ref<number | null>(null)
const weatherData = ref<any>(null)
const locationPermissionGranted = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const fetchWeatherData = async (lat: number, lon: number) => {
  try {
    isLoading.value = true
    const response = await axios.post('/retrieve-data', {
      latitude: lat,
      longitude: lon,
    })
    weatherData.value = response.data
    console.log('Weather data received:', response.data)
  } catch (error) {
    console.error('Error fetching weather data:', error)
  } finally {
    isLoading.value = false
  }
}

async function getIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json')
    return response.data.ip
  } catch (error) {
    console.error('Error fetching IP address:', error)
    return null
  }
}

async function getAproximateLocationByIP() {
  try {
    const ip = await getIP()
    if (!ip) {
      throw new Error('Could not retrieve IP address')
    }
    const response = await axios.get(`https://ipapi.co/${ip}/json/`)
    const { latitude, longitude } = response.data
    latitud.value = latitude
    longitud.value = longitude
    await fetchWeatherData(latitude, longitude)
  } catch (error) {
    console.error('Error fetching approximate location by IP:', error)
  }
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
      await getAproximateLocationByIP()
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
</script>

<template>
  <div class="dashboard">
    <header class="mb-10 mt-5 flex justify-center">
      <AutocompletableSearch v-model="place" />
    </header>
    <div class="grid grid-cols-4 gap-4">
      <div class="grid col-span-3 grid-cols-3 gap-4 *:max-h-70">
        <WeatherCard class="col-span-2" :weather-data="weatherData" />
        <ProbabilityChart :weather-data="weatherData" />
        <Card title="Wind Status">
          <TrendGraph :weather-data="weatherData" />
        </Card>
        <Card title="UV Index">
          <UvIndex :weather-data="weatherData" />
        </Card>
        <NasaMap class="row-span-5" :lat="latitud" :lon="longitud" />
        <Card title="Humidity">
          <Humidity :weather-data="weatherData" />
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
        <Card />
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
