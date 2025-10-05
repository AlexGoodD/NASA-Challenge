<script setup lang="ts">
import Card from '~/components/UI/Card.vue'
</script>

<template>
  <Card class="bg-[#C3DBEE] text-[#1C1C1C] px-4 py-3 rounded-lg shadow-md">
    <div class="top flex justify-between items-center">
      <div class="flex w-full items-center justify-between pt-4">
        <h2 class="text-[2.8rem] font-semibold leading-none text-[#1C1C1C] pb-2">16°</h2>
        <i class="wi wi-day-cloudy text-[2.8rem] text-black"></i>
      </div>
    </div>

    <!-- Sección inferior: datos + amanecer/atardecer -->
    <div class="bottom flex justify-between items-center mt-3 text-sm text-[#1C1C1C]/90">
      <div class="flex flex-col gap-0.5">
        <p class="font-semibold text-[#000]">
          <span class="font-light text-gray-500">Real Feel</span> 18°
        </p>
        <p class="font-semibold text-[#000]">
          <span class="font-light text-gray-500">Wind N.E.</span> 6.7 km/h
        </p>
        <p class="font-semibold text-[#000]">
          <span class="font-light text-gray-500">Pressure</span> 1008 MB
        </p>
        <p class="font-semibold text-[#000]">
          <span class="font-light text-gray-500">Humidity</span> 51%
        </p>
      </div>

      <div class="flex flex-col justify-between text-[#1C1C1C]/80">
        <p class="font-semibold text-[#000]">
          <span class="font-light text-gray-500">Sunrise</span> 5:30 AM
        </p>
        <p class="font-semibold text-[#000]">
          <span class="font-light text-gray-500">Sunset</span> 6:45 PM
        </p>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.top {
  line-height: 1;
}
.bottom {
  line-height: 1.4;
}
</style>
