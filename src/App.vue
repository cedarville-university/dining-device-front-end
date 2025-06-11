<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useConfiguration from './composables/useConfiguration'
import { useRouter } from 'vue-router'
import DeviceLayout from './layouts/DeviceLayout.vue'
import RequestFullscreen from './components/RequestFullscreen.vue'

const { hasConfig, deviceDimension } = useConfiguration()

const router = useRouter()
onMounted(() => {
  if (!hasConfig) {
    router.push('/config')
  }
})
</script>

<template>
  <RequestFullscreen>
    <div class="min-h-dvh grid place-content-center">
      <span v-if="!deviceDimension">This device has not been configured</span>
      <DeviceLayout v-else :device-dimension show-bezels>
        <RouterView />
      </DeviceLayout>
    </div>
  </RequestFullscreen>
</template>
