<script setup>
defineProps({
  title: String,
  noBackground: {
    type: Boolean,
    default: false,
  },
  square: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div :class="['card', { 'no-bg': noBackground, square }]">
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
  height: 100%;
}

/* 🔹 Tarjeta sin fondo */
.card.no-bg {
  background: transparent;
}

/* 🔹 Tarjeta cuadrada */
.card.square {
  aspect-ratio: 1 / 1; /* Mantiene proporción cuadrada */
  height: auto; /* Permite que se ajuste automáticamente */
}

/* 🔹 Estilos del contenido */
.card-header {
  font-weight: 100;
  font-size: large;
  margin-bottom: 0.5rem;
}

.card-body {
  flex: 1;
}
</style>
