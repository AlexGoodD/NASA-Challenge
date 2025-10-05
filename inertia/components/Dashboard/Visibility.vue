<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visibility: number
}>()

const message = computed(() => {
  if (props.visibility >= 10) return 'La visibilidad es buena'
  if (props.visibility >= 5) return 'La visibilidad es moderada'
  return 'La visibilidad es mala'
})
</script>

<template>
  <div class="flex flex-col items-center text-white space-y-2">
    <CloudFog class="text-gray-300" :size="100" />

    <div class="text-center">
      <h2 class="text-2xl font-bold">{{ visibility }} km</h2>
      <div class="flex items-center space-x-2 text-sm text-gray-400">
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
