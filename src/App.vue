<script setup lang="ts">
import DeviceLayout from './layouts/DeviceLayout.vue'
</script>

<template>
  <div class="group/main @container/main">
    <DeviceLayout>
      <RouterView />
    </DeviceLayout>
  </div>
</template>
