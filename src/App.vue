<script setup lang="ts">
import DeviceLayout from './layouts/DeviceLayout.vue'
</script>

<template>
  <div class="group/main @container/main">
    <DeviceLayout class="mx-auto my-auto">
      <RouterView />
    </DeviceLayout>
  </div>
</template>
