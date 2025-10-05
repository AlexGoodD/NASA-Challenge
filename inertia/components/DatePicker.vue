<script setup lang="ts">
import { ref, watch } from 'vue'

const model = defineModel<string>('')

const input = ref<HTMLInputElement | null>(null)

watch(model, (val) => {
  if (!val) return

  let cleaned = val.replace(/\D/g, '')

  if (cleaned.length > 8) cleaned = cleaned.slice(0, 8)

  if (cleaned.length > 4) {
    cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`
  } else if (cleaned.length > 2) {
    cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
  }

  if (cleaned !== val) model.value = cleaned
})
</script>

<template>
  <div class="relative">
    <div class="relative">
      <input
        ref="input"
        v-model="model"
        class="h-10 bg-neutral-800 rounded-lg focus:outline-none p-2 px-3 w-96 placeholder:text-neutral-400 shadow-xl shadow-sky-300/5"
        placeholder="DD/MM/AAAA"
        type="text"
        name="date"
        maxlength="10"
      />

      <button
        class="absolute right-1 inset-y-1 p-1 bg-neutral-700 rounded-[0.35rem] aspect-square flex items-center justify-center hover:bg-neutral-600 active:scale-[.97] transition-all"
        type="button"
      >
        <Calendar class="stroke-neutral-400" :size="20" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
