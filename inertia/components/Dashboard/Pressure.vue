<script setup lang="ts">
import { ref } from 'vue'

const pressureData = ref([1012, 1013, 1014, 1013, 1015, 1014, 1016])
</script>

<template>
  <div class="flex flex-col items-center text-white space-y-2">
    <Gauge class="text-gray-300" :size="100" />

    <div class="text-center">
      <h2 class="text-2xl font-bold">{{ pressureData[pressureData.length - 1] }} hPa</h2>
      <p class="text-gray-400 text-sm">Pressure trend (last few minutes)</p>
    </div>
  </div>
</template>

<style scoped></style>
