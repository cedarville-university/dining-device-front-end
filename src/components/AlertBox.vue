<script setup lang="ts">
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import { computed } from 'vue'

export type AlertVariant = 'success' | 'error' | 'warning'

const { variant = 'success' } = defineProps<{
  title?: string
  variant?: AlertVariant
}>()

const iconBgColor = computed(
  () =>
    ({
      success: 'bg-green-200',
      warning: 'bg-orange-200',
      error: 'bg-red-200',
    })[variant],
)

const bodyBgColor = computed(
  () =>
    ({
      success: 'bg-green-100',
      warning: 'bg-orange-100',
      error: 'bg-red-100',
    })[variant],
)

const borderColor = computed(
  () =>
    ({
      success: 'border-green-800',
      warning: 'border-orange-800',
      error: 'border-red-800',
    })[variant],
)

const textColor = computed(
  () =>
    ({
      success: 'text-green-800',
      warning: 'text-orange-800',
      error: 'text-red-800',
    })[variant],
)

const icon = computed(
  () =>
    ({
      success: `
  `,
      warning: `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-12"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
      `,
      error: ``,
    })[variant],
)
</script>

<template>
  <div
    class="grid grid-cols-[auto_1fr] items-center border-2 rounded-md overflow-clip"
    :class="[bodyBgColor, textColor, borderColor]"
  >
    <div class="p-4 h-full flex flex-col justify-center" :class="iconBgColor">
      <slot v-if="$slots.icon" name="icon" />
      <CheckCircleIcon v-else-if="variant === 'success'" class="size-8" />
      <XCircleIcon v-else-if="variant === 'error'" class="size-8" />
      <ExclamationTriangleIcon v-else-if="variant === 'warning'" class="size-8" />
    </div>

    <div class="space-y-2 p-4">
      <h4 v-if="title" class="font-semibold text-md">{{ title }}</h4>
      <p>
        <slot />
      </p>
    </div>
  </div>
</template>
