<script setup lang="ts">
import { computed } from 'vue'
import { useConfigurationStore } from '@/stores/configurationStore'
import { storeToRefs } from 'pinia'

const {
  orientation,
  deviceWidth,
  deviceHeight,
  primaryColor,
  secondaryColor,
  grayColor,
  headerHeight,
  headerBg,
  headerColor,
  viewHeight,
  viewWidth,
  canvasBg,
  canvasColor,
  bezelBg,
  bezelWidth,
  bezelRadius,
} = storeToRefs(useConfigurationStore())

const style = computed(() => [
  `--device-orientation: ${orientation.value}`,
  `--device-width: ${deviceWidth.value}px`,
  `--device-height: ${deviceHeight.value}px`,
  `--primary-color: ${primaryColor.value}`,
  `--secondary-color: ${secondaryColor.value}`,
  `--gray-color: ${grayColor.value}`,
  `--header-height: ${headerHeight.value}px`,
  `--header-bg: ${headerBg.value}`,
  `--header-color: ${headerColor.value}`,
  `--view-height: ${viewHeight.value}px`,
  `--view-width: ${viewWidth.value}px`,
  `--canvas-bg: ${canvasBg.value}`,
  `--canvas-color: ${canvasColor.value}`,
  `--bezel-bg: ${bezelBg.value}`,
  `--bezel-width: ${bezelWidth.value}px`,
  `--bezel-radius: ${bezelRadius.value}px`,
])

const dataAttributes = computed(() => ({
  'data-device-orientation': orientation.value,
  'data-device-height': deviceHeight.value,
  'data-device-width': deviceWidth.value,
  'data-header-height': headerHeight.value,
  'data-view-height': viewHeight.value,
  'data-view-width': viewWidth.value,
}))
</script>

<template>
  <div
    id="DeviceRoot"
    :style
    v-bind="dataAttributes"
    class="group/device @container/device w-(--device-width) relative h-(--device-height) box-content bg-(--canvas-bg) border-(length:--bezel-width) border-(color:--bezel-bg) rounded-(--bezel-radius) accent-(--secondary-color)"
  >
    <slot />
  </div>
</template>

<style>
* {
  accent-color: var(--secondary-color);
}
::marker {
  color: var(--secondary-color);
}
</style>
