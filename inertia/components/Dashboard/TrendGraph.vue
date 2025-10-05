<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Chart } from 'chart.js/auto'
import { generateHourlyLabels } from '~/helpers/DayHoursLabel'

interface Props {
  hourlyData: Record<number, number>
}

const props = defineProps<Props>()

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
  const canvas = document.getElementById('trendGraph') as HTMLCanvasElement
  if (!canvas) throw new Error('Canvas element not found')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2D context')

  const gradient = ctx.createLinearGradient(0, 0, 0, 200)
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(1, 'rgba(255,255,255,0.1)')

  const selectedGradient = ctx.createLinearGradient(0, 0, 0, 200)
  selectedGradient.addColorStop(0, 'rgba(59, 130, 246, 0.9)')
  selectedGradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)')

  const labels = generateHourlyLabels()
  const data = windData.value.map((value) => value.toFixed(2))

  const getBarColors = () => {
    return windData.value.map((_, index) => {
      if (index === selectedHour.value) {
        return selectedGradient
      }
      return gradient
    })
  }

  const chart = new Chart(ctx, {
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
        x: {
          display: false, // oculta eje X
          grid: { display: false },
        },
        y: {
          display: false, // oculta eje Y
          grid: { display: false },
        },
      },
      onHover: (_, elements) => {
        canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default'
      },
      onClick: (_, elements) => {
        if (elements.length > 0) {
          const clickedIndex = elements[0].index
          selectedHour.value = clickedIndex

          // Actualizar los colores de las barras
          chart.data.datasets[0].backgroundColor = getBarColors()
          chart.update()
        }
      },
    },
  })
})
</script>

<template>
  <div class="wind-status">
    <canvas id="trendGraph"></canvas>
    <div class="info">
      <span
        ><strong>{{ windData[selectedHour].toFixed(2) }}</strong> km/h</span
      >
      <p>
        <span>{{
          selectedHour > 12 ? selectedHour - 12 : selectedHour === 0 ? 12 : selectedHour
        }}</span
        ><span>{{ selectedHour >= 12 ? 'PM' : 'AM' }}</span>
      </p>
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
