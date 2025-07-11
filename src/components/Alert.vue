<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import { useTemplateRef, watch } from 'vue'

export type AlertVariant = 'success' | 'error'

const { variant = 'success', timeout = 5000 } = defineProps<{
  variant?: AlertVariant
  timeout?: number
}>()

const dialog = useTemplateRef('dialogRef')
let timeoutId = 0
const showModal = () => {
  if (timeoutId) clearTimeout(timeout)

  dialog.value?.show()
  if (timeout > 0) {
    timeoutId = setTimeout(() => {
      message.value = undefined
    }, timeout)
  }
}

const message = defineModel<string>()
watch(message, (newMessage) => {
  if (newMessage) {
    showModal()
  } else {
    dialog.value?.close()
  }
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="hidden absolute inset-[10px_10px_auto_auto] starting:-translate-y-5 starting:opacity-0 translate-y-0 opacity-100 p-4 rounded-md shadow transition-all open:flex gap-2 items-center"
    :class="{
      'bg-green-200 border border-green-500 text-green-800': variant === 'success',
      'bg-red-200 border border-red-500 text-red-800': variant === 'error',
    }"
  >
    <CheckCircleIcon v-if="variant === 'success'" class="size-5" />
    <XCircleIcon v-if="variant === 'error'" class="size-5" />
    {{ message }}
  </dialog>
</template>
