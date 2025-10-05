<script setup lang="ts">
const props = defineProps<{
  placeName: string
}>()

const encodedPlaceName = encodeURIComponent(props.placeName)
</script>

<template>
  <div id="map" class="w-full h-full rounded-xl overflow-hidden pointer-events-none">
    <iframe
      width="100%"
      height="100%"
      style="border: 0; filter: invert(90%) hue-rotate(180deg) contrast(1)"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyBgIvcFsv6SpFFUjdJBGkEjW0yItzgOsbk&q=${encodedPlaceName}`"
    >
    </iframe>
  </div>
</template>
