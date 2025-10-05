<script setup lang="ts">
import { ref, computed } from 'vue'

// 🔹 Valores base (pueden venir de props o API)
const temperature = ref<number>(30) // °C
const humidity = ref<number>(70) // %

// 🔹 Cálculo del índice de calor (Heat Index)
const heatIndex = computed<number>(() => {
  const T = temperature.value
  const R = humidity.value

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

  // ✅ Convertimos a número para evitar errores de tipo
  return Number(HI.toFixed(1))
})

// 🔹 Texto descriptivo según el nivel de calor
const heatLevel = computed<string>(() => {
  const hi = heatIndex.value
  if (hi < 27) return 'Comfortable'
  if (hi < 32) return 'Caution: Warm'
  if (hi < 41) return 'Extreme caution'
  return 'Danger: Very Hot!'
})
</script>

<template>
  <div class="flex flex-col items-center text-white space-y-2">
    <ThermometerSun class="text-gray-300" :size="100" />

    <div class="text-center">
      <h2 class="text-2xl font-bold">{{ heatIndex }}°C</h2>
      <p class="text-gray-400 text-sm">{{ heatLevel }}</p>
    </div>
  </div>
</template>

<style scoped></style>
