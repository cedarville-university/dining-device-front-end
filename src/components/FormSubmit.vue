<script setup lang="ts">
import AppButton from './AppButton.vue'
</script>

<template>
  <Teleport to="#PageHeaderAction" defer>
    <AppButton v-bind="$attrs" type="submit">
      <slot>Save</slot>
    </AppButton>
  </Teleport>
</template>
