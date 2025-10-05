<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import mapboxgl, { type Map } from 'mapbox-gl'

interface Props {
  lat: number
  lon: number
  date: Date
  placeName: string
}

const props = defineProps<Props>()

let map: Map | null = null
const mapContainer = ref(null)
mapboxgl.accessToken =
  'pk.eyJ1IjoiZmhlcjAzMTEiLCJhIjoiY21nZDhlZGRrMGNrbTJpcHpyZWdmYmVocyJ9.HWzBxg1lABSKNG25BXmpXA'

function refreshMap(currentMap: Map | null) {
  if (!currentMap) return
  currentMap.on('load', () => {
    const formatDate = props.date.toISOString().split('T')[0]
    console.log(formatDate)

    if (!currentMap) return
    currentMap.addSource(`nasa-imagery-source`, {
      type: 'raster',
      tiles: [
        `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${formatDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
      ],
      tileSize: 256,
      maxzoom: 9,
      attribution:
        '<a href="https://earthdata.nasa.gov/eosdis/science-system-description/services-and-tools/gibs">NASA GIBS</a>',
    })

    currentMap.addLayer({
      id: 'nasa-imagery-layer',
      type: 'raster',
      source: 'nasa-imagery-source',
      paint: {
        'raster-opacity': 1,
      },
    })
  })
}

function createMap() {
  if (mapContainer.value) {
    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [props.lon, props.lat],
      zoom: 9,
    })
  }
}
watch(props, () => {
  if ((props.lat || props.lon) && !props.placeName) {
    createMap()
    refreshMap(map)
  }
  if (props.placeName) {
    map?.flyTo({
      center: [props.lon, props.lat],
      speed: 1.5,
    })
    console.log(props.placeName)
  }
})
onMounted(() => {
  if (!props.lon || !props.lat) return
  createMap()
  refreshMap(map)
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
