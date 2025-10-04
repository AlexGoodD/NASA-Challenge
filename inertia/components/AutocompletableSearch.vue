<script setup lang="ts">
import axios from 'axios'
import { nextTick, ref, watch } from 'vue'
import type { PlacesApiResponse } from '../../services/GoogleMapsService'
import { debounce } from 'lodash-es'
import { onClickOutside, useFocus } from '@vueuse/core'

const placesEndpoint = axios.create({ baseURL: '/api/places' })
const model = defineModel<PlacesApiResponse['places'][number]>()
const search = ref('')
const results = ref<PlacesApiResponse['places']>([])
const isLoading = ref(false)
let doNotTriggerSearch = false
const didRequestErrored = ref(false)

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

watch([search], () => {
  if (doNotTriggerSearch) {
    toggleSearchTriggerProtection()
    return
  }
  if (didRequestErrored) didRequestErrored.value = false
  isLoading.value = true
  debounceFetch()
})

function toggleSearchTriggerProtection() {
  doNotTriggerSearch = !doNotTriggerSearch
}

const input = ref()
const dropdown = ref()
const { focused } = useFocus(input)
const isActive = ref(false)

watch(focused, () => {
  isActive.value = true
})

watch(isActive, (value) => {
  if (!value) {
    toggleSearchTriggerProtection()
    if (model.value) search.value = model.value.displayName.text
  }
})

onClickOutside(dropdown, () => {
  if (!isActive) return
  isActive.value = false
})

function updateModel(value: any) {
  input.value.blur()
  nextTick(() => {
    isActive.value = false
    model.value = value
  })
}
</script>

<template>
  <div class="relative">
    <div class="relative">
      <input
        class="h-10 bg-neutral-800 rounded-lg focus:outline-none p-2 px-3 w-96 placeholder:text-neutral-400 shadow-xl shadow-sky-300/5"
        placeholder="¿A dónde quieres ir?"
        type="text"
        name="place"
        ref="input"
        v-model="search"
        v-bind="$attrs"
      />
      <button
        class="absolute right-1 inset-y-1 p-1 bg-neutral-700 rounded-[0.35rem] aspect-square flex items-center justify-center hover:bg-neutral-600 active:scale-[.97] transition-all"
      >
        <Search :size="20" class="stroke-neutral-400" />
      </button>
    </div>
    <div
      ref="dropdown"
      class="absolute top-12 inset-x-0 rounded-lg bg-neutral-800 shadow-xl shadow-white/5 z-50 overflow-hidden"
      v-if="isActive"
    >
      <ul v-if="results.length" class="grid">
        <li
          v-for="result in results"
          class="px-3 py-2 hover:bg-neutral-700 cursor-pointer flex items-center gap-2"
          @mousedown="!isLoading ? updateModel(result) : null"
        >
          <div class="grid">
            <span class="leading-tight text-sm uppercase">{{ result.displayName.text }}</span>
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
