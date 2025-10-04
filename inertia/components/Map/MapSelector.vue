<script setup>
import L from 'leaflet'
import { onMounted } from 'vue'

onMounted(() => {
  const map = L.map('map', { zoomControl: false }).setView([23.81, 90.41], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  map.on('click', (e) => {
    alert(`Selected: ${e.latlng.lat}, ${e.latlng.lng}`)
  })
})
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  height: 300px;
  border-radius: 12px;
  margin-bottom: 1rem;
}
</style>
