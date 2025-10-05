<script setup lang="ts">
defineProps<{
  pressure: number
}>()
</script>

<template>
  <div class="flex flex-col items-center text-white space-y-5">
    <Gauge class="text-gray-300" :size="100" />

    <div class="text-center">
      <h2 class="text-2xl font-bold">{{ pressure }} hPa</h2>
      <p class="text-gray-400 text-sm">Tendencia de presión</p>
    </div>
  </div>
</template>

<style scoped></style>
