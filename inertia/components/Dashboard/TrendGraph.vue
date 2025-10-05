<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import type { Chart as ChartInstance } from 'chart.js/auto'
import { generateHourlyLabels } from '~/helpers/DayHoursLabel'

interface Props {
  hourlyData: Record<number, number>
}

const props = defineProps<Props>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartInstance<'bar'> | null = null

const actualHour = new Date().getHours()
const selectedHour = ref(actualHour)

const windData = computed(() => {
  const data = []
  for (let i = 0; i < 24; i++) {
    data.push(props.hourlyData[i] || 0)
  }
  return data
})

onMounted(() => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  const gradient = ctx.createLinearGradient(0, 0, 0, 200)
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(1, 'rgba(255,255,255,0.1)')

  const selectedGradient = ctx.createLinearGradient(0, 0, 0, 200)
  selectedGradient.addColorStop(0, 'rgba(59, 130, 246, 0.9)')
  selectedGradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)')

  const labels = generateHourlyLabels()
  const data = windData.value.map((value) => value.toFixed(2))

  const getBarColors = (): (CanvasGradient | string)[] => {
    return windData.value.map((_, index) => {
      return index === selectedHour.value ? selectedGradient : gradient
    })
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: getBarColors(),
          borderRadius: 3,
          barThickness: 6,
          maxBarThickness: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { display: false, grid: { display: false } },
        y: { display: false, grid: { display: false } },
      },
      onHover: (_, elements) => {
        if (canvasRef.value) {
          canvasRef.value.style.cursor = elements.length > 0 ? 'pointer' : 'default'
        }
      },
      onClick: (_, elements) => {
        if (elements.length > 0 && chartInstance) {
          selectedHour.value = elements[0].index
          chartInstance.data.datasets[0].backgroundColor = getBarColors()
          chartInstance.update()
        }
      },
    },
  })
})

watch(windData, (newData) => {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = newData.map((value) => value.toFixed(2))
    chartInstance.update()
  }
})
</script>

<template>
  <div class="wind-status">
    <canvas ref="canvasRef"></canvas>
    <div class="flex justify-between mt-1">
      <span
        ><strong>{{ windData[selectedHour].toFixed(2) }}</strong> km/h</span
      >

      <span
        >{{ selectedHour > 12 ? selectedHour - 12 : selectedHour === 0 ? 12 : selectedHour }}
        {{ selectedHour >= 12 ? 'PM' : 'AM' }}
      </span>
    </div>
  </div>
</template>
