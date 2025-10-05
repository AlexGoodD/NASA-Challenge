<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  hourlyData: Record<number, number>
  dewPoint: number
}

const props = defineProps<Props>()

const probability = computed(() => props.hourlyData?.[0] ?? 0)

const weatherStyle = computed(() => {
  const p = probability.value

  if (p <= 10) return { icon: 'wi wi-day-sunny', color: '#FFD700' }
  if (p <= 30) return { icon: 'wi wi-day-cloudy', color: '#F5F5F5' }
  if (p <= 60) return { icon: 'wi wi-cloudy', color: '#A0AEC0' }
  if (p <= 80) return { icon: 'wi wi-showers', color: '#4299E1' }
  return { icon: 'wi wi-thunderstorm', color: '#1E40AF' }
})
</script>

<template>
  <div class="flex flex-col items-center text-white space-y-5">
    <i :class="weatherStyle.icon" :style="{ fontSize: '100px' }" class="text-gray-300"></i>

    <div class="text-center">
      <h2 class="text-2xl font-bold">{{ props.hourlyData?.[0] ?? '--' }} %</h2>
      <div class="flex items-center space-x-2 text-sm text-gray-400">
        <p>El punto de rocío es de {{ props.dewPoint }}°C</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
