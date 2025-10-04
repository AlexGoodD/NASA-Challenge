<script setup lang="ts">
import { onMounted } from 'vue'
import { Chart } from 'chart.js/auto'

const value = 5.5 // valor actual de UV
const maxValue = 12 // máximo del índice UV

onMounted(() => {
  const ctx = document.getElementById('uvChart').getContext('2d')

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [value, maxValue - value],
          backgroundColor: ['#3b82f6', '#1f2937'], // azul + gris oscuro
          borderWidth: 0,
          cutout: '70%',
        },
      ],
    },
    options: {
      responsive: true,
      rotation: -90, // empieza desde arriba
      circumference: 180, // solo medio círculo
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
