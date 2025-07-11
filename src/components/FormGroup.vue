<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="bg-white rounded-md shadow">
    <h3 v-if="title" class="px-4 pt-4 font-semibold text-lg row-start-1 col-span-full mb-4">
      {{ title }}
    </h3>

    <div class="p-4 space-y-4">
      <slot />
    </div>

    <div v-if="$slots.actions" class="flex p-4 rounded-[inherit] bg-(--gray-color)/50">
      <slot name="actions" />
    </div>
  </div>
</template>
