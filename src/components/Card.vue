<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="bg-white border rounded p-4 space-y-3 shadow">
    <slot name="header">
      <h2 class="font-semibold text-xl">{{ title }}</h2>
    </slot>
    <slot />
  </div>
</template>
