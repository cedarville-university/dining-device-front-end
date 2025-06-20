<script setup lang="ts">
import DeviceLayout from './layouts/DeviceLayout.vue'
import useConfiguration from './composables/useConfiguration'

const { showBezel } = useConfiguration()
</script>

<template>
  <div class="group/main @container/main min-h-dvh grid place-content-center">
    <DeviceLayout :show-bezels="showBezel">
      <Suspense>
        <RouterView />
      </Suspense>
    </DeviceLayout>
  </div>
</template>
