// resources/js/Pages/BaseMap.vue

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'

// --- 1. CONFIGURACIÓN ---
// ¡IMPORTANTE! Reemplaza esto con tu token de acceso público de Mapbox.
mapboxgl.accessToken =
  'pk.eyJ1IjoiZmhlcjAzMTEiLCJhIjoiY21nZDhlZGRrMGNrbTJpcHpyZWdmYmVocyJ9.HWzBxg1lABSKNG25BXmpXA'

// Referencia al elemento DIV que contendrá el mapa.
const mapContainer = ref(null)

// Variable para mantener la instancia del mapa y poder acceder a ella.
let map = null

// --- 2. INICIALIZACIÓN ---
// onMounted se asegura de que el código se ejecute después de que el
// componente se haya montado en el DOM y el div 'mapContainer' exista.
onMounted(() => {
  console.log(mapContainer.value)
  if (mapContainer.value) {
    map = new mapboxgl.Map({
      container: mapContainer.value, // El elemento div del mapa.
      style: 'mapbox://styles/mapbox/streets-v12', // Estilo base del mapa. Puedes cambiarlo.
      center: [-99.1332, 19.4326], // Coordenadas iniciales [longitud, latitud] (Ciudad de México).
      zoom: 9, // Nivel de zoom inicial.
    })
  }
})

// --- 3. LIMPIEZA ---
// onUnmounted elimina el mapa cuando el componente se destruye.
// Esto previene fugas de memoria si navegas a otra página.
onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <div ref="mapContainer"></div>
</template>
