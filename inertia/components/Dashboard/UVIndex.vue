<script setup lang="ts">
import { onMounted } from 'vue'
import { Chart } from 'chart.js/auto'

const value = 5.5 // valor actual de UV
const maxValue = 12 // máximo del índice UV

onMounted(() => {
  const canvas = document.getElementById('uvChart') as HTMLCanvasElement | null
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [value, maxValue - value],
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
    <div class="uv-value"><strong>5.50</strong> UV</div>
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
