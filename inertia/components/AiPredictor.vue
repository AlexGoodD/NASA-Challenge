<script setup lang="ts">
import axios from 'axios'
import { Send } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { gsap } from 'gsap'
import { Place } from '../../services/GoogleMapsService';

const props = defineProps<{
  place: Place
}>()

const predictViabilityEndpoint = axios.create({
  baseURL: '/api/weather/predict-viability',
  headers: {
    'Content-Type': 'application/json',
  },
})

const userPlan = ref('')
const date = '2026-01-01'

type ResponseData = {
  score: number
  justification: string
  recommendations: string[]
}

const prediction = ref<ResponseData | null>({
  score: 95,
  justification:
    'Las condiciones meteorológicas son casi ideales para andar en bicicleta. La temperatura es muy agradable (22°C), la humedad es moderada (60%) y la velocidad del viento es ligera (10 km/h), lo que lo hace cómodo para actividades al aire libre. La visibilidad es excelente.',
  recommendations: [
    'Aplica protector solar debido al índice UV moderado (5).',
    'Mantente hidratado durante tu actividad física.',
    'Viste ropa adecuada para ciclismo para mayor comodidad.',
    'Verifica el estado de tu bicicleta antes de iniciar el recorrido.',
  ],
})

const isGeneratingJustification = ref(false)
const _justification = ref('')
const _recommendations = ref<string[]>([])

watch(
  prediction,
  (newPrediction) => {
    if (newPrediction) {
      isGeneratingJustification.value = true
      _justification.value = ''
      let index = 0
      const interval = setInterval(() => {
        if (index < newPrediction.justification.length) {
          _justification.value += newPrediction.justification[index]
          index++
        } else {
          clearInterval(interval)
        }
      }, 10)
      setTimeout(
        () => {
          isGeneratingJustification.value = false
          _recommendations.value = newPrediction.recommendations
        },
        newPrediction.justification.length * 10 + 30
      )
    }
  },
  { immediate: true }
)

async function sendPredictionRequest() {
  try {
    const response = await predictViabilityEndpoint.get('', {
      params: {
        lat: props.place.location.latitude,
        lon: props.place.location.longitude,
        userPlan: userPlan.value,
        date: date,
        placeName: props.place.displayName.text,
      },
    })

    prediction.value = response.data as ResponseData
    console.log('Predicción recibida:', prediction.value)
  } catch (error) {
    console.error('Error al enviar la solicitud de predicción:', error)
  }
}

function onBeforeEnter(el: any) {
  el.style.opacity = 0
  el.style.height = 0
}

function onEnter(el: any, done: any) {
  gsap.to(el, {
    opacity: 1,
    height: 'auto',
    delay: el.dataset.index * 0.2,
    onComplete: done,
  })
}

function onLeave(el: any, done: any) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * 0.2,
    onComplete: done,
  })
}
</script>

<template>
  <div class="flex justify-end flex-col h-[82dvh] w-full">
    <div class="w-full w-full h-full">
      <div v-if="prediction" class="flex flex-col *:py-2">
        <div class="!pt-0 flex flex-col">
          <span> Puntaje de viabilidad </span>
          <span
            class="font-bold text-6xl"
            :class="{
              'text-green-500': prediction.score >= 75,
              'text-yellow-500': prediction.score >= 40 && prediction.score < 75,
              'text-red-500': prediction.score < 40,
            }"
          >
            {{ prediction.score }}%
          </span>
        </div>
        <div>
          <p class="text-neutral-300">{{ _justification }}</p>
        </div>
        <div>
          <h3 class="font-semibold mt-4 mb-2" v-if="!isGeneratingJustification">
            Algunas recomendaciones
          </h3>
          <TransitionGroup
            tag="ul"
            :css="false"
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave"
          >
            <div
              v-for="(rec, index) in _recommendations"
              :key="index"
              class="bg-neutral-700/50 mb-2 px-2 py-2 rounded-md leading-[18px]"
            >
              {{ rec }}
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
    <button
      class="mb-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold p-2 rounded-md transition-colors w-fit self-end disabled:opacity-50 disabled:cursor-not-allowed"
      @click="sendPredictionRequest"
      :disabled="!userPlan"
    >
      <Send :size="16" />
    </button>
    <textarea
      class="py-2 px-3 bg-neutral-700 rounded-md resize-none placeholder:text-neutral-400 focus:outline-none"
      rows="3"
      placeholder="¿Qué planes tienes?"
      v-model="userPlan"
    ></textarea>
  </div>
</template>
