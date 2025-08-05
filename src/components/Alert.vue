<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import AlertBox, { type AlertVariant } from '@/components/AlertBox.vue'

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
    class="not-open:hidden absolute inset-[10px_10px_auto_auto] starting:-translate-y-5 starting:opacity-0 translate-y-0 opacity-100 transition-all bg-transparent shadow-xl"
  >
    <AlertBox :variant>
      {{ message }}
    </AlertBox>
  </dialog>
</template>
