<script setup lang="ts">
import DeviceLayout from './layouts/DeviceLayout.vue'
</script>

<template>
  <div class="group/main @container/main min-h-dvh grid place-content-center">
    <DeviceLayout>
      <RouterView />
    </DeviceLayout>
  </div>
</template>
