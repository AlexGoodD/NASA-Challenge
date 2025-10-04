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

const requestLocationPermission = () => {
  if (!navigator.geolocation) {
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitud.value = position.coords.latitude
      longitud.value = position.coords.longitude
      locationPermissionGranted.value = true
      fetchWeatherData(position.coords.latitude, position.coords.longitude)
    },
    (error: GeolocationPositionError) => {
      locationPermissionGranted.value = false
      //TODO: Poner ubicacion aproximada por IP
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
        <MapSelector
          :place-name="place?.displayName?.text || 'Ubicación actual'"
          :latitude="latitud"
          :longitude="longitud"
          class="row-span-3 max-h-max"
        />
        <Card title="Humidity">
          <Humidity :weather-data="weatherData" />
        </Card>
        <Card title="Visibility">
          <Visibility :weather-data="weatherData" />
        </Card>
        <Card title="Humidity">
          <Humidity :weather-data="weatherData" />
        </Card>
        <Card title="Visibility">
          <Visibility :weather-data="weatherData" />
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
