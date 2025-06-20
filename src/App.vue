<script lang="ts">
export const injectionKey = Symbol() as InjectionKey<{ rerender: () => void }>
</script>

<script setup lang="ts">
import { provide, ref, useId, type InjectionKey } from 'vue'
import DeviceLayout from './layouts/DeviceLayout.vue'
import useConfiguration from './composables/useConfiguration'

const { showBezel } = useConfiguration()

const renderKey = ref(useId())
provide(injectionKey, {
  rerender: () => (renderKey.value = useId()),
})
</script>

<template>
  <div class="group/main @container/main min-h-dvh grid place-content-center">
    <DeviceLayout :show-bezels="showBezel" :key="renderKey">
      <RouterView />
    </DeviceLayout>
  </div>
</template>
