<script setup lang="ts">
const cities = [
  { country: 'China', name: 'Beijing', weather: 'Cloudy' },
  { country: 'US', name: 'California', weather: 'Windy' },
  { country: 'Dubai', name: 'Arab Emirates', weather: 'Mostly Sunny' },
]
</script>

<template>
  <div class="city-list">
    <div v-for="city in cities" :key="city.name" class="city">
      <div class="ml-4">
        <h4 class="text-sm mb-2">{{ city.country }}</h4>
        <h4 class="text-xl mb-2">{{ city.name }}</h4>
        <p class="text-sm">{{ city.weather }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.city {
  background: #1b1a1d;
  padding: 1rem 0.5rem;
  border-radius: 1.2rem;
  margin-bottom: 1.5rem;
}
</style>
