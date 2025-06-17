<script lang="ts">
export const injectionKey = Symbol() as InjectionKey<{ rerender: () => void }>
</script>

<script setup lang="ts">
import { provide, ref, type InjectionKey } from 'vue'
import DeviceLayout from './layouts/DeviceLayout.vue'
import useConfiguration from './composables/useConfiguration'

const { showBezel } = useConfiguration()

const renderKey = ref(crypto.randomUUID())
provide(injectionKey, {
  rerender: () => (renderKey.value = crypto.randomUUID()),
})
</script>

<template>
  <div class="group/main @container/main min-h-dvh grid place-content-center">
    <DeviceLayout :show-bezels="showBezel" :key="renderKey">
      <RouterView />
    </DeviceLayout>
  </div>
</template>
