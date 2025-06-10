<script setup lang="ts">
import { ref } from 'vue'

const inFullScreen = ref(true)
const handleFullscreen = () => {
  document.documentElement.requestFullscreen()
  inFullScreen.value = true
}
</script>

<template>
  <div v-if="!inFullScreen" class="min-h-dvh grid place-content-center">
    <button
      v-if="!inFullScreen"
      @click="handleFullscreen"
      class="bg-primary text-white text-xl font-semibold px-3 py-2 rounded"
    >
      Enter Fullscreen
    </button>
  </div>
  <slot v-else />
</template>
