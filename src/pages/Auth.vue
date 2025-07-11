<script setup lang="ts">
import useAuth from '@/composables/useAuth'
import useIdleTimeout from '@/composables/useIdleTimeout'
import { useWindowEvent } from '@/composables/useWindowEvent'
import { useConfigurationStore } from '@/stores/configurationStore'
import { BackspaceIcon, CheckCircleIcon } from '@heroicons/vue/20/solid'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { auth } = storeToRefs(useConfigurationStore())

const pin = ref('')

const router = useRouter()
const { login } = useAuth()

const handleKeypress = (e: KeyboardEvent) => {
  handleInput(e.key)
}

useWindowEvent('keydown', handleKeypress)

const handleInput = (num: string) => {
  switch (num) {
    case 'Delete':
    case 'Backspace':
      pin.value = pin.value.substring(0, pin.value.length - 1)
      break
    case 'Enter':
      if (pin.value.length === 6 && auth.value?.configuration === pin.value) {
        pin.value = ''
        login()
        router.replace({ name: 'config' })
      }
      break
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      if (pin.value.length < 6) pin.value += num
      break
  }
}

// enter the kiosk after an idle period of 5 seconds
useIdleTimeout(() => router.replace({ name: 'kiosk' }), 5000)
</script>
<template>
  <div class="min-h-(--device-height) grid place-content-center">
    <div class="bg-white border border-t-0 rounded-md p-8 shadow space-y-4">
      <div class="flex gap-1 items-center justify-center">
        <input
          disabled
          :type="pin.length > 1 ? 'password' : 'text'"
          v-model="pin[0]"
          max="4"
          class="flex-1 text-2xl font-bold text-center w-8 aspect-square border rounded"
        />
        <input
          disabled
          :type="pin.length > 2 ? 'password' : 'text'"
          v-model="pin[1]"
          max="4"
          class="flex-1 text-2xl font-bold text-center w-8 aspect-square border rounded"
        />
        <input
          disabled
          :type="pin.length > 3 ? 'password' : 'text'"
          v-model="pin[2]"
          max="4"
          class="flex-1 text-2xl font-bold text-center w-8 aspect-square border rounded"
        />
        <input
          disabled
          :type="pin.length > 4 ? 'password' : 'text'"
          v-model="pin[3]"
          max="4"
          class="flex-1 text-2xl font-bold text-center w-8 aspect-square border rounded"
        />
        <input
          disabled
          :type="pin.length > 5 ? 'password' : 'text'"
          v-model="pin[4]"
          max="4"
          class="flex-1 text-2xl font-bold text-center w-8 aspect-square border rounded"
        />
        <input
          disabled
          type="text"
          v-model="pin[5]"
          max="4"
          class="flex-1 text-2xl font-bold text-center w-8 aspect-square border rounded"
        />
      </div>
      <ul class="grid gap-2 grid-cols-3 items-center">
        <li
          v-for="num in ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'Delete', '0', 'Enter']"
          :key="num"
        >
          <button
            @click="handleInput(num)"
            class="grid gap-1 p-4 w-24 aspect-square place-content-center border rounded-lg text-2xl hover:bg-gray-100 active:bg-gray-100 focus-within:bg-gray-100"
            :class="{
              'text-gray-400': num === 'Delete',
            }"
          >
            <BackspaceIcon v-if="num === 'Delete'" class="size-5" />
            <CheckCircleIcon v-else-if="num === 'Enter'" class="size-5 text-green-500" />
            <span v-else>{{ num }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
