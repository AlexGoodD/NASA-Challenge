<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import type { PlacesApiResponse } from '../../services/GoogleMapsService'
import { debounce } from 'lodash-es'
import { useFocus } from '@vueuse/core'

const props = defineProps<{
  initialValue?: string
}>()

const placesEndpoint = axios.create({ baseURL: '/api/places' })
const model = defineModel<PlacesApiResponse['places'][number]>()
const search = ref(props.initialValue ?? '')
const results = ref<PlacesApiResponse['places']>([])
const isLoading = ref(false)
let doNotTriggerSearch = false
const didRequestErrored = ref(false)

const input = ref<HTMLInputElement>()
const { focused } = useFocus(input)
const isDropdownActive = ref(false)

onMounted(async () => {
  if (props.initialValue) {
    const response = await placesEndpoint.get(`?q=${encodeURIComponent(props.initialValue)}`)
    results.value = response.data.places
    updateModel(results.value[0] ?? null)
  }
})

async function fetch() {
  try {
    const response = await placesEndpoint.get(`?q=${search.value}`)
    results.value = response.data.places
  } catch {
    didRequestErrored.value = true
  } finally {
    isLoading.value = false
  }
}

const debounceFetch = debounce(fetch, 500)

watch(search, () => {
  if (doNotTriggerSearch) {
    doNotTriggerSearch = false
    return
  }
  if (didRequestErrored) didRequestErrored.value = false
  isLoading.value = true
  debounceFetch()
})

watch(focused, (isFocused) => {
  if (isFocused) {
    isDropdownActive.value = true
  } else {
    setTimeout(() => {
      isDropdownActive.value = false
    }, 200)
  }
})

watch(isDropdownActive, (isActive) => {
  if (!isActive && model.value && search.value !== model.value.displayName.text) {
    doNotTriggerSearch = true
    search.value = model.value.displayName.text
  }
})

function updateModel(value: PlacesApiResponse['places'][number] | null) {
  model.value = value
  if (value) {
    doNotTriggerSearch = true
    search.value = value.displayName.text
  }
  isDropdownActive.value = false
}
</script>

<template>
  <div class="relative">
    <div class="relative">
      <input
        class="bg-neutral-800 rounded-full focus:outline-none py-3 px-4 w-120 placeholder:text-neutral-400 shadow-xl shadow-sky-300/5"
        placeholder="Busca un lugar..."
        type="text"
        name="place"
        ref="input"
        v-model="search"
        v-bind="$attrs"
        autocomplete="off"
      />
      <button
        class="absolute right-1 inset-y-1 p-1 bg-neutral-700 rounded-full aspect-square flex items-center justify-center hover:bg-neutral-600 active:scale-[.97] transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="stroke-neutral-400"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </button>
    </div>
    <div
      class="absolute top-14 inset-x-0 rounded-lg bg-neutral-800 shadow-xl shadow-white/5 z-50 overflow-hidden"
      v-if="isDropdownActive"
    >
      <ul v-if="results.length" class="grid">
        <li
          v-for="result in results"
          :key="result.id"
          class="px-3 py-2 hover:bg-neutral-700 cursor-pointer flex items-center gap-2"
          @mousedown="!isLoading ? updateModel(result) : null"
        >
          <div class="grid">
            <span class="leading-tight text-sm">{{ result.displayName.text }}</span>
            <span class="text-sm line-clamp-1 text-stone-400">
              {{ result.formattedAddress }}
            </span>
          </div>
        </li>
      </ul>
      <p class="px-3 py-2 opacity-50" v-else-if="!search.length">
        Por favor comienza a escribir para buscar :)
      </p>
      <p class="px-3 py-2 opacity-50" v-else-if="isLoading">Buscando...</p>
      <p class="px-3 py-2 opacity-50" v-else-if="didRequestErrored">
        Ocurrió un error al buscar el lugar, lo sentimos.
      </p>
      <p class="px-3 py-2 opacity-50" v-else>No logramos encontrar el lugar que buscabas :(</p>
    </div>
  </div>
</template>
