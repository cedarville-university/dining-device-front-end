<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="p-4 mx-auto space-y-4 bg-white rounded-lg shadow max-w-xl">
    <slot name="header">
      <h2 class="font-semibold text-xl">{{ title }}</h2>
    </slot>
    <div>
      <slot />
    </div>
  </div>
</template>
