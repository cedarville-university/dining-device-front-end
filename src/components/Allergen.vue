<script setup lang="ts">
import { allergenLabels } from '@/functions/allergenLabels'

defineProps<{ allergen: string }>()
</script>

<template>
  <figure class="flex gap-2 flex-col items-center rounded px-1 py-1">
    <img :src="allergen" class="max-w-16" />
    <figcaption class="wrap-anywhere text-pretty max-w-full bg-white">
      {{ allergenLabels.get(allergen) }}
    </figcaption>
  </figure>
</template>
