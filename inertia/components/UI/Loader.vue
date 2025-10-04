<script setup lang="ts"></script>

<template>
  <div class="loader"></div>
</template>

<style scoped>
.loader {
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: auto;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
