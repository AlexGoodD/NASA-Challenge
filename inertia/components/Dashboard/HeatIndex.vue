<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  temperature: number
  humidity: number
}>()

const heatIndex = computed<number>(() => {
  const T = props.temperature
  const R = props.humidity

  const HI =
    -8.784695 +
    1.61139411 * T +
    2.338549 * R -
    0.14611605 * T * R -
    0.012308094 * T * T -
    0.016424828 * R * R +
    0.002211732 * T * T * R +
    0.00072546 * T * R * R -
    0.000003582 * T * T * R * R

  return Number(HI.toFixed(1))
})

const heatLevel = computed<string>(() => {
  const hi = heatIndex.value
  if (hi < 27) return 'Temperatura ideal, ¡disfruta el día!'
  if (hi < 32) return 'Hace calor, ¡mantente fresco e hidratado!'
  if (hi < 41) return '¡Mucho cuidado! El calor es intenso, busca la sombra.'
  return '¡Peligro! Calor extremo, evita salir si no es necesario.'
})
</script>

<template>
  <div class="flex flex-col items-center text-white space-y-5">
    <ThermometerSun class="text-gray-300" :size="100" />
    <div class="text-center">
      <h2 class="text-2xl font-bold">{{ heatIndex }}°C</h2>
      <p class="text-gray-400 text-sm">{{ heatLevel }}</p>
    </div>
  </div>
</template>

<style scoped></style>
