<script setup lang="ts">
import axios from 'axios'
import { ArrowUp, LoaderCircle } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { gsap } from 'gsap'
import { Place } from '../../services/GoogleMapsService'
import CalendarComponent from '~/components/CalendarComponent.vue'

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
const date = ref(new Date().toISOString().split('T')[0])

type ResponseData = {
  score: number
  justification: string
  recommendations: string[]
}

const prediction = ref<ResponseData | null>()

const isGeneratingJustification = ref(false)
const isLoading = ref(false)

const _score = ref(0)
const _justification = ref('')
const _recommendations = ref<string[]>([])

watch(
  prediction,
  (newPrediction) => {
    if (newPrediction) {
      isGeneratingJustification.value = true

      _score.value = Math.max(newPrediction.score - 30, 0)
      _justification.value = ''
      _recommendations.value = []

      let index = 0

      const scoreInterval = setInterval(() => {
        if (_score.value < newPrediction.score) {
          _score.value++
        } else {
          clearInterval(scoreInterval)
        }
      }, 20)
      const justificationInterval = setInterval(() => {
        if (index < newPrediction.justification.length) {
          _justification.value += newPrediction.justification[index]
          index++
        } else {
          clearInterval(justificationInterval)
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
    isLoading.value = true
    prediction.value = null
    const planToSend = userPlan.value.trim()
    userPlan.value = ''
    const response = await predictViabilityEndpoint.get('', {
      params: {
        lat: props.place.location.latitude,
        lon: props.place.location.longitude,
        userPlan: planToSend,
        date: date.value,
        placeName: props.place.displayName.text,
      },
    })

    prediction.value = response.data as ResponseData
  } catch (error) {
    console.error('Error al enviar la solicitud de predicción:', error)
  } finally {
    isLoading.value = false
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
    delay: el.dataset.index * 100,
    onComplete: done,
  })
}

function onLeave(el: any, done: any) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * 100,
    onComplete: done,
  })
}
</script>

<template>
  <div class="flex flex-col h-[80dvh] max-h-[82dvh] w-full -mt-4">
    <div class="flex-1 overflow-y-auto pr-3 pt-3 -mx-4 px-4 pb-5">
      <div v-if="prediction" class="flex flex-col *:py-2 text-sm">
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
            {{ _score }}%
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
            tag="div"
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

      <div v-else-if="isLoading" class="flex flex-col items-center justify-center h-full gap-4">
        <LoaderCircle :size="48" class="stroke-neutral-500 animate-[spin_0.75s_infinite]" />
      </div>
      <div
        v-else
        class="text-neutral-500 text-2xl text-center font-semibold flex items-center justify-center h-full"
      >
        <p class="w-50">Obtén un análisis de viabilidad y recomendaciones para tus planes.</p>
      </div>
    </div>

    <div class="flex flex-col relative z-10 -mx-4 -mb-4">
      <button
        class="mb-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold p-1 rounded-md transition-colors w-fit self-end disabled:opacity-0 disabled:cursor-not-allowed absolute -top-10 right-3"
        @click="sendPredictionRequest"
        :disabled="!userPlan"
      >
        <ArrowUp :size="24" />
      </button>
      <CalendarComponent v-model="date" />
      <textarea
        class="py-2 px-3 bg-neutral-700 rounded-xl resize-none placeholder:text-neutral-400 focus:outline-none"
        rows="3"
        placeholder="¿Qué planes tienes?"
        v-model="userPlan"
        @keydown.enter.prevent="sendPredictionRequest"
        :disabled="isLoading || isGeneratingJustification"
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 1px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px var(--color-neutral-800);
  margin-top: 14px;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-neutral-600);
  border-radius: 10px;
}
</style>
