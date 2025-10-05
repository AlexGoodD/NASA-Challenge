<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import type { Chart as ChartInstance } from 'chart.js/auto'
import Card from '~/components/UI/Card.vue'

interface Props {
  hourlyData: Record<number, number>
}

const props = defineProps<Props>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartInstance | null = null

const chartData = computed(() => {
  const data = []
  for (let i = 0; i < 24; i++) {
    data.push(props.hourlyData[i] || 0)
  }
  return data
})

onMounted(() => {
  if (!chartCanvas.value) return

  function generateHourlyLabels() {
    const labels = []
    for (let i = 0; i < 24; i++) {
      const hour = i === 0 ? 12 : i > 12 ? i - 12 : i
      const period = i < 12 ? 'AM' : 'PM'
      labels.push(`${hour}${period}`)
    }
    return labels
  }

  const labels = generateHourlyLabels()

  chartInstance = new Chart(chartCanvas.value, {
    data: {
      labels,
      datasets: [
        {
          type: 'line',
          data: chartData.value,
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
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 50,
            callback: (value) => {
              if (value === 100) return 'Alta'
              if (value === 50) return 'Media'
              if (value === 0) return 'Baja'
              return ''
            },
          },
          grid: { color: 'rgba(255,255,255,0.1)' },
        },
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            callback: function (_value, index) {
              const chart = this.chart
              const hourLabel = chart.data.labels[index]
              const probability = chart.data.datasets[0].data[index]
              return [hourLabel, `${probability}%`]
            },
          },
        },
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
  <Card title="Probabilidad de lluvia">
    <div class="overflow-x-hidden pt-4">
      <div class="overflow-x-auto">
        <div class="min-w-[200px]">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>
    </div>
  </Card>
</template>
