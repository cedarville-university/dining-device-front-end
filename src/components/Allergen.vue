<script setup lang="ts">
import { allergenLabels } from '@/functions/allergenLabels'

defineProps<{ allergen: string }>()
</script>

<template>
  <figure class="flex flex-col items-center justify-between rounded-md bg-(--canvas-bg)/25 w-full">
    <img
      :src="allergen"
      class="w-5/6 @[200px]/allergens:w-2/3 @[350px]/allergens:w-1/2 grid my-2 bg-white rounded-full border-2 border-white shadow"
    />
    <figcaption class="w-full p-1 text-xs max-w-full">
      {{ allergenLabels.get(allergen) }}
    </figcaption>
  </figure>
</template>
