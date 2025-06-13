<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="bg-white rounded p-4 space-y-3 shadow">
    <slot name="header">
      <h2 class="font-semibold text-xl">{{ title }}</h2>
    </slot>
    <div class="bg-gray-100">
      <slot />
    </div>
  </div>
</template>
