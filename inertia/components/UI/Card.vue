<script setup lang="ts">
defineProps<{
  title?: string
  noBackground?: boolean
  square?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'flex flex-col h-full rounded-xl p-4 text-white',
      noBackground ? 'bg-transparent' : 'bg-[#1b1a1d]',
      square && 'aspect-square h-auto',
    ]"
  >
    <header v-if="title" class="text-xs font-bold mb-4 uppercase -mt-1">
      {{ title }}
    </header>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
