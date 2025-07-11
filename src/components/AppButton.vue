<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  to?: string | { name: string; params?: Record<string, string> }
  variant?: 'primary' | 'secondary' | 'ghost'
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
    'hover:outline-1',
    'hover:outline-(--secondary-color)',
    'focus:outline-1',
    'focus:outline-(--secondary-color)',
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
    case 'ghost':
      return [
        ...classes,
        'text-[color-mix(in_oklch,var(--gray-color),black_40%)]',
        'border-transparent',
        'hover:border',
        'hover:bg-(--gray-color)/50',
        'hover:text-[color-mix(in_oklch,var(--gray-color),black_80%)]',
        'hover:border-(--gray-color)/50',
        'active:border',
        'active:text-[color-mix(in_oklch,var(--gray-color),black_80%)]',
        'active:border-(--gray-color)/50',
        'focus-visible:border',
        'focus-visible:text-[color-mix(in_oklch,var(--gray-color),black_80%)]',
        'focus-visible:border-(--gray-color)/50',
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
