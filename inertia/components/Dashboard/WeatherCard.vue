<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherData } from '#controllers/WeatherController'

const props = defineProps<{
  weather: WeatherData
}>()

const weatherIcon = computed(() => {
  const icon = props.weather.current.weather.icon
  switch (icon) {
    case '01d':
      return 'sunny_day'
    case '01n':
      return 'sunny_night'
    case '02d':
    case '03d':
    case '04d':
      return 'cloudy_day'
    case '02n':
    case '03n':
    case '04n':
      return 'cloudy_night'
    case '09d':
    case '10d':
      return 'rainy_day'
    case '09n':
    case '10n':
      return 'rainy_night'
    case '11d':
      return 'stormy_day'
    case '11n':
      return 'stormy_night'
    case '13d':
      return 'snowy_day'
    case '13n':
      return 'snowy_night'
    case '50d':
    case '50n':
      return 'cloudy_day'
    default:
      return 'sunny_day'
  }
})

const iconPath = computed(() => {
  switch (weatherIcon.value) {
    case 'sunny_day':
      return '/Sunny.svg'
    case 'sunny_night':
      return '/Night.svg'
    case 'cloudy_day':
      return '/Cloudy.svg'
    case 'cloudy_night':
      return '/Cloudnight.svg'
    case 'rainy_day':
    case 'rainy_night':
      return '/Rain.svg'
    case 'stormy_day':
      return '/Thundershower.svg'
    case 'stormy_night':
      return '/ThundershowerNight.svg'
    case 'snowy_day':
    case 'snowy_night':
      return '/Snow.svg'
    default:
      return '/Sunny.svg'
  }
})
</script>

<template>
  <div
    class="flex flex-row h-full rounded-xl bg-gradient-to-tr px-4 py-3 shadow-md justify-between"
    :class="{
      'from-gray-800 to-gray-600': weatherIcon === 'sunny_night',
      'from-yellow-400 to-yellow-200 ': weatherIcon === 'sunny_day',
      'from-gray-700 to-gray-500': weatherIcon === 'cloudy_night',
      'from-gray-400 to-gray-200': weatherIcon === 'cloudy_day',
      'from-blue-700 to-blue-500': weatherIcon === 'rainy_night',
      'from-blue-400 to-blue-200': weatherIcon === 'rainy_day',
      'from-purple-700 to-purple-500': weatherIcon === 'stormy_night',
      'from-purple-400 to-purple-200': weatherIcon === 'stormy_day',
      'from-gray-600 to-gray-400': weatherIcon === 'snowy_night',
      'from-white to-gray-300': weatherIcon === 'snowy_day',
      'text-black': weatherIcon.endsWith('day'),
      'text-white': weatherIcon.endsWith('night'),
    }"
  >
    <div class="flex flex-col justify-between">
      <h2 class="text-[2.8rem] font-semibold leading-none pb-2">
        {{ Math.round(weather.current.temperature) }}°
      </h2>

      <div class="bottom flex justify-between items-center text-sm">
        <div class="flex flex-col gap-0.5">
          <p class="font-semibold">
            <span class="text-neutral-500">Sensación térmica</span>
            {{ weather.current.feelsLike }}°
          </p>
          <p class="font-semibold">
            <span class="text-neutral-500">Viento</span> {{ weather.current.windSpeed }} km/h
          </p>
          <p class="font-semibold">
            <span class="text-neutral-500">Humedad</span>
            {{ weather.current.humidity }}%
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center mr-4">
      <img :src="iconPath" alt="Weather Icon" class="w-24 h-24" />
    </div>
  </div>
</template>

<style scoped>
@import 'weather-icons/css/weather-icons.min.css';
.top {
  line-height: 1;
}
.bottom {
  line-height: 1.4;
}
</style>
