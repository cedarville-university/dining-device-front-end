<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <header
    id="PageHeader"
    class="group/header @container/header px-4 p-1 flex items-center justify-between h-(--header-height) bg-(--header-bg) text-(--header-color)"
  >
    <h1 class="text-2xl">{{ title }}</h1>

    <div v-if="$slots.default" id="PageHeaderAction" class="flex items-center gap-2">
      <slot />
    </div>
  </header>
</template>
