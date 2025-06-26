<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div
    class="bg-white overflow-clip rounded-2xl shadow-lg space-y-4 grid grid-cols-[min-content_1fr] w-full min-w-md max-w-lg"
  >
    <h3
      class="col-start-1 bg-(--primary-color) rounded-l-2xl border-r-10 border-r-(--secondary-color) text-white text-[64px] text-center font-extrabold uppercase text-shadow-xs px-8 py-2 [writing-mode:sideways-lr]"
    >
      {{ title }}
    </h3>
    <div class="p-8 space-y-4 my-auto">
      <slot />
    </div>
  </div>
</template>
