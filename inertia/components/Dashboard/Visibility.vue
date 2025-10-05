<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-center text-white space-y-2">
    <CloudFog class="text-gray-300" :size="100" />

    <div class="text-center">
      <h2 class="text-2xl font-bold">4 km</h2>
      <div class="flex items-center space-x-2 text-sm text-gray-400">
        <Eye />
        <p>Haze is affecting visibility</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
