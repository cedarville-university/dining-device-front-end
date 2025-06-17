<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{ to: string }>()
</script>

<template>
  <RouterLink
    :to
    class="px-4 py-2 bg-gray-500/5 active:bg-gray-500/15 hover:bg-gray-500/15 focus-visible:bg-gray-500/15 text-lg w-full rounded"
    active-class="bg-(--header-bg)! text-(--header-color)! active:bg-(--header-bg)! hover:bg-(--header-bg)! focus-visible:bg-(--header-bg)! "
  >
    <slot />
  </RouterLink>
</template>
