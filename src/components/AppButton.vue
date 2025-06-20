<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  to?: string
  variant?: 'primary' | 'secondary'
}

const { variant = 'primary' } = defineProps<Props>()

const classes = computed(() => {
  const classes = [
    'py-2',
    'px-3',
    'rounded',
    'border',
    'touch-manipulation',
    'cursor-pointer',
    'transition-all',
  ]

  switch (variant) {
    case 'primary':
      return [
        ...classes,
        'bg-(--header-color)/10',
        'border-(--header-color)/12',
        'active:bg-(--header-color)/15',
        'active:border-(--header-color)/17',
        'hover:bg-(--header-color)/15',
        'hover:border-(--header-color)/17',
        'focus-visible:bg-(--header-color)/15',
        'focus-visible:border-(--header-color)/17',
      ]
    case 'secondary':
      return [
        ...classes,
        'text-(--header-color)/80',
        'border-transparent',
        'border-(--header-color)/15',
        'hover:border',
        'hover:text-(--header-color)/90',
        'hover:border-(--header-color)/17',
        'active:border',
        'active:text-(--header-color)/90',
        'active:border-(--header-color)/17',
        'focus-visible:border',
        'focus-visible:text-(--header-color)/90',
        'focus-visible:border-(--header-color)/17',
      ]
  }
})
</script>

<template>
  <RouterLink v-if="to" :to v-bind="$attrs" :class="classes">
    <slot />
  </RouterLink>
  <button v-else v-bind="$attrs" :class="classes">
    <slot />
  </button>
</template>
