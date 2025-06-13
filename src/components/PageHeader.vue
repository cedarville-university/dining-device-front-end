<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <header
    class="group/header @container/header px-4 p-1 flex items-center justify-between h-(--header-height) bg-(--header-bg) text-(--header-color)"
  >
    <h1 class="text-2xl">{{ title }}</h1>

    <slot v-if="$slots.default" />
  </header>
</template>
