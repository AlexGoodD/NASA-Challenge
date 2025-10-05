<script setup lang="ts">
import { onMounted } from 'vue'
import { Chart } from 'chart.js/auto'

interface Props {
  uvIndex: number
  maxUvIndex: number
}

const props = defineProps<Props>()

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
          data: [props.uvIndex, props.maxUvIndex - props.uvIndex],
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
    <div class="text-2xl font-bold">{{ uvIndex?.toFixed(2) }} UV</div>
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
</style>
