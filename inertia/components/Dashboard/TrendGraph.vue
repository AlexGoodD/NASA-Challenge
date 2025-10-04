<script setup lang="ts">
import { onMounted } from 'vue'
import { Chart } from 'chart.js/auto'

onMounted(() => {
  const ctx = document.getElementById('trendGraph').getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 200)
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(1, 'rgba(255,255,255,0.1)')

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from({ length: 20 }, (_, i) => i + 1),
      datasets: [
        {
          data: [2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3],
          backgroundColor: gradient,
          borderRadius: 3,
          barThickness: 6,
          maxBarThickness: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          display: false, // oculta eje X
          grid: { display: false },
        },
        y: {
          display: false, // oculta eje Y
          grid: { display: false },
        },
      },
    },
  })
})
</script>

<template>
  <div class="wind-status">
    <canvas id="trendGraph"></canvas>
    <div class="info">
      <span><strong>7.50</strong> km/h</span>
      <span>6:20 AM</span>
    </div>
  </div>
</template>

<style scoped>
.wind-status {
  display: flex;
  flex-direction: column;
  align-items: center;
}
canvas {
  max-height: 120px;
  width: 100%;
}
.info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.info strong {
  font-weight: 700;
}
</style>
