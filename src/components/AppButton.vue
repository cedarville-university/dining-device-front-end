<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  to?: string
}

defineProps<Props>()

const classes = computed(() => [
  'p-2',
  'active:bg-white/15',
  'border',
  'border-transparent',
  'active:border-white/15',
  'rounded',
  'touch-manipulation',
])
</script>

<template>
  <RouterLink v-if="to" :to v-bind="$attrs" :class="classes">
    <slot />
  </RouterLink>
  <button v-else v-bind="$attrs" :class="classes">
    <slot />
  </button>
</template>
