<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart } from 'chart.js/auto'

const value = ref<number | null>(null) // valor actual de UV
const maxValue = ref<number | null>(null) // máximo del índice UV

interface Props {
  uvIndex: number
}

const props = defineProps<Props>()

onMounted(() => {
  const canvas = document.getElementById('uvChart') as HTMLCanvasElement | null
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  value.value = props.dailyData.uv_index_max[0] || 0
  maxValue.value = props.dailyData.uv_index_clear_sky_max[0] || 0 // Valor máximo típico para el índice UV
  if (!maxValue.value || !value.value) {
    return
  }

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [value.value, maxValue.value - value.value],
          backgroundColor: ['#2BA3FC', '#D3EEFE'],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      rotation: -90,
      circumference: 180,
      cutout: '85%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    },
  })
})
</script>

<template>
  <div class="uv-index">
    <canvas id="uvChart"></canvas>
    <div class="text-2xl font-bold">{{ value?.toFixed(2) }} UV</div>
  </div>
</template>

<style scoped>
.uv-index {
  display: flex;
  flex-direction: column;
  align-items: center;
}
canvas {
  max-height: 120px;
}
.uv-value {
  margin-top: -10px;
  font-size: 1rem;
  font-weight: 600;
}
</style>
