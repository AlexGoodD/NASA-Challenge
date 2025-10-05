<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherData } from '#controllers/WeatherController'

const props = defineProps<{
  weather: WeatherData
}>()

const temperature = computed(() => Math.round(props.weather.current.temperature))
const feelsLike = computed(() => Math.round(props.weather.current.feelsLike))
const windSpeed = computed(() => Math.round(props.weather.current.windSpeed))

const weatherInfo = computed(() => {
  const code = props.weather.current.weatherCode
  if ([0].includes(code)) return { mood: 'sunny', icon: 'wi-day-sunny' }
  if ([1, 2, 3].includes(code)) return { mood: 'cloudy', icon: 'wi-day-cloudy' }
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { mood: 'rainy', icon: 'wi-rain' }
  if ([95, 96, 99].includes(code)) return { mood: 'stormy', icon: 'wi-thunderstorm' }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { mood: 'snowy', icon: 'wi-snow' }
  return { mood: 'cloudy', icon: 'wi-day-cloudy' }
})

function getTimeOfDay() {
  const hour = +props.weather.current.time.split('T')[1].split(':')[0]
  if (hour >= 6 && hour < 18) {
    return 'day'
  } else {
    return 'night'
  }
}

const iconPaths = {
  sunny: '/Sunny.svg',
  cloudy: '/Cloudy.svg',
  rainy: '/Rain.svg',
  stormy: '/Thundershower.svg',
  snowy: '/Snow.svg',
}

const nightIconPaths = {
  sunny: '/Night.svg',
  cloudy: '/Cloudnight.svg',
  rainy: '/Rain.svg',
  stormy: '/ThundershowerNight.svg',
  snowy: '/Snow.svg',
}
</script>

<template>
  <div
    class="flex flex-row h-full rounded-xl bg-gradient-to-tr px-4 py-3 shadow-md justify-between"
    :class="{
      'from-gray-800 to-gray-600': weatherInfo.mood === 'sunny' && getTimeOfDay() === 'night',
      'from-yellow-400 to-yellow-200 ': weatherInfo.mood === 'sunny' && getTimeOfDay() === 'day',
      'from-gray-700 to-gray-500': weatherInfo.mood === 'cloudy' && getTimeOfDay() === 'night',
      'from-gray-400 to-gray-200': weatherInfo.mood === 'cloudy' && getTimeOfDay() === 'day',
      'from-blue-700 to-blue-500': weatherInfo.mood === 'rainy' && getTimeOfDay() === 'night',
      'from-blue-400 to-blue-200': weatherInfo.mood === 'rainy' && getTimeOfDay() === 'day',
      'from-purple-700 to-purple-500': weatherInfo.mood === 'stormy' && getTimeOfDay() === 'night',
      'from-purple-400 to-purple-200': weatherInfo.mood === 'stormy' && getTimeOfDay() === 'day',
      'from-gray-600 to-gray-400': weatherInfo.mood === 'snowy' && getTimeOfDay() === 'night',
      'from-white to-gray-300': weatherInfo.mood === 'snowy' && getTimeOfDay() === 'day',
      'text-black': getTimeOfDay() === 'day',
      'text-white': getTimeOfDay() === 'night',
    }"
  >
    <div class="flex flex-col justify-between">
      <h2 class="text-[2.8rem] font-semibold leading-none pb-2">{{ temperature }}°C</h2>

      <div class="bottom flex justify-between items-center text-sm /90">
        <div class="flex flex-col gap-0.5">
          <p class="font-semibold">
            <span class="text-neutral-500">Sensación térmica</span> {{ feelsLike }}°
          </p>
          <p class="font-semibold">
            <span class="text-neutral-500">Viento</span> {{ windSpeed }} km/h
          </p>
          <p class="font-semibold">
            <span class="text-neutral-500">Presión</span>
            {{ weather.current.pressure.toFixed(2) }} hPa
          </p>
          <p class="font-semibold">
            <span class="text-neutral-500">Humedad</span> {{ weather.current.humidity }}%
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center mr-4">
      <img
        :src="
          getTimeOfDay() === 'day' ? iconPaths[weatherInfo.mood] : nightIconPaths[weatherInfo.mood]
        "
        alt="Weather Icon"
        class="w-24 h-24"
      />
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
