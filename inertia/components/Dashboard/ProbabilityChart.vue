<script setup lang="ts">
import { onMounted } from 'vue'
import { Chart } from 'chart.js/auto'
import Card from '~/components/UI/Card.vue'

onMounted(() => {
  const ctx = document.getElementById('rainChart')

  new Chart(ctx, {
    data: {
      labels: ['10AM', '11AM', '12PM', '1PM', '2PM', '3PM'],
      datasets: [
        {
          type: 'bar',
          data: [30, 40, 70, 50, 80, 20],
          backgroundColor: 'rgb(233,241,255)',
          borderRadius: 5,
          barThickness: 4,
        },
        {
          type: 'line',
          data: [30, 40, 70, 50, 80, 20],
          borderColor: '#658ab5',
          backgroundColor: '#60a5fa',
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#2e8bff',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 50,
            callback: (value) => {
              if (value === 100) return 'Rainy'
              if (value === 50) return 'Sunny'
              if (value === 0) return 'Heavy'
              return ''
            },
          },
          grid: { color: 'rgba(255,255,255,0.1)' },
        },
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
        },
      },
    },
  })
})
</script>

<template>
  <Card>
    <canvas id="rainChart"></canvas>
  </Card>
</template>

<style scoped></style>
