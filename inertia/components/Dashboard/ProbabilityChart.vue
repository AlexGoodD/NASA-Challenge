<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { Chart } from 'chart.js/auto'
import Card from '~/components/UI/Card.vue'
import { generateHourlyLabels } from '~/helpers/DayHoursLabel'

interface Props {
  hourlyData: Record<number, number>
}

const props = defineProps<Props>()

const chartData = computed(() => {
  const data = []
  for (let i = 0; i < 24; i++) {
    data.push(props.hourlyData[i] || 0)
  }
  return data
})
onMounted(() => {
  const ctx = document.getElementById('rainChart')
  if (!ctx) return

  const labels = generateHourlyLabels()
  const data = chartData.value

  new Chart(ctx as HTMLCanvasElement, {
    data: {
      labels,
      datasets: [
        {
          type: 'line',
          data,
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
              if (value === 100) return 'Lluvioso'
              if (value === 50) return 'Soleado'
              if (value === 0) return 'Fuerte'
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
              const hourLabel = labels[index]
              const probability = data[index]
              return [hourLabel, `${probability}%`]
            },
          },
        },
      },
    },
  })
})
</script>

<template>
  <Card title="Probabilidad de lluvia">
    <div class="overflow-x-hidden">
      <div class="overflow-x-auto">
        <div class="min-w-[1000px]">
          <canvas id="rainChart"></canvas>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped></style>
