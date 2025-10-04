<script setup>
defineProps({
  title: String,
  noBackground: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div :class="['card', { 'no-bg': noBackground }]">
    <header v-if="title" class="card-header">{{ title }}</header>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #1b1a1d;
  border-radius: 12px;
  padding: 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100%; /* fuerza a ocupar toda la altura de la celda */
}
.card.no-bg {
  background: transparent; /* elimina el fondo */
}
.card-header {
  font-weight: 100;
  font-size: large;
  margin-bottom: 0.5rem;
}
.card-body {
  flex: 1; /* empuja el contenido para distribuir espacio */
}
</style>
