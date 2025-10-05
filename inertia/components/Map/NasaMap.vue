<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import mapboxgl from 'mapbox-gl'

interface Props {
  lat: number
  lon: number
}

const props = defineProps<Props>()
// --- 1. CONFIGURACIÓN ---
// ¡IMPORTANTE! Reemplaza esto con tu token de acceso público de Mapbox.
mapboxgl.accessToken =
  'pk.eyJ1IjoiZmhlcjAzMTEiLCJhIjoiY21nZDhlZGRrMGNrbTJpcHpyZWdmYmVocyJ9.HWzBxg1lABSKNG25BXmpXA'

// Referencia al elemento DIV que contendrá el mapa.
const mapContainer = ref(null)

// Variable para mantener la instancia del mapa y poder acceder a ella.
let map = null

function fetchMap() {
  map.on('load', () => {
    console.log(map.getStyle().layers)
    const aDate = '2024-10-03' // Puedes cambiar esta fecha

    map.addSource(`nasa-imagery-source`, {
      type: 'raster',
      tiles: [
        `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${aDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
      ],
      tileSize: 256,
      maxzoom: 9,
      attribution:
        '<a href="https://earthdata.nasa.gov/eosdis/science-system-description/services-and-tools/gibs">NASA GIBS</a>',
    })

    map.addLayer(
      {
        id: 'nasa-imagery-layer',
        type: 'raster',
        source: 'nasa-imagery-source',
        paint: {
          'raster-opacity': 1, // La pongo en 1 para que sea bien visible
        },
      }
      // --- ESTA ES LA SOLUCIÓN ---
      // Dibuja nuestra capa justo debajo de las etiquetas de las ciudades.
    )
  })
}

function createMap() {
  if (mapContainer.value) {
    map = new mapboxgl.Map({
      container: mapContainer.value, // El elemento div del mapa.
      style: 'mapbox://styles/mapbox/dark-v11', // Estilo base del mapa. Puedes cambiarlo.
      center: [props.lon, props.lat], // Coordenadas iniciales [longitud, latitud] (Ciudad de México).
      zoom: 9, // Nivel de zoom inicial.
    })
  }
}
watch(
  () => props.lat || props.lon,
  () => {
    createMap()
    fetchMap()
  }
)
onMounted(() => {
  if (!props.lon || !props.lat) return
  createMap()
  fetchMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <div ref="mapContainer"></div>
</template>
