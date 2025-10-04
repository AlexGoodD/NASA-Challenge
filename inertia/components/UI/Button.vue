<script setup lang="ts"></script>

<template>
  <button class="btn">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  background: #2563eb;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.btn:hover {
  background: #1d4ed8;
}
</style>
