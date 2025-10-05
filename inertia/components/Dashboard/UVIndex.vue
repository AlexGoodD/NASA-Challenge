<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { Chart } from 'chart.js/auto'
import type { Chart as ChartInstance } from 'chart.js/auto'

interface Props {
  uvIndex: number
  maxUvIndex: number
}

const props = defineProps<Props>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartInstance<'doughnut'> | null = null

const chartData = computed(() => [props.uvIndex, props.maxUvIndex - props.uvIndex])

onMounted(() => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: chartData.value,
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

watch(chartData, (newData) => {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = newData
    chartInstance.update()
  }
})
</script>

<template>
  <div class="uv-index">
    <canvas ref="canvasRef"></canvas>
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
