<script setup lang="ts">
import useConfiguration from '@/composables/useConfiguration'
import { computed } from 'vue'

interface Props {
  showBezels?: boolean
}
const { showBezels = false } = defineProps<Props>()

const { layout, deviceDimension: dimensions } = useConfiguration()

const deviceHeight = computed(() => dimensions.value?.height ?? 0)
const deviceWidth = computed(() => dimensions.value?.width ?? 0)

const headerHeight = computed(() => layout.value?.header.height ?? 0)
const headerBg = computed(() => layout.value?.header.bgColor ?? '#003865')
const headerColor = computed(() => layout.value?.header.color ?? 'var(--color-white)')

const viewHeight = computed(() => deviceHeight.value - headerHeight.value)
const viewWidth = computed(() => deviceWidth.value)

const canvasBg = computed(() => layout.value?.canvas.bgColor ?? 'var(--color-gray-100)')

const bezelWidth = computed(() => (showBezels ? (layout.value?.bezel.width ?? 0) : 0))
const bezelBg = computed(() => layout.value?.bezel.bgColor ?? 'var(--color-black)')
const bezelRadius = computed(() => bezelWidth.value / 2)

const style = computed(() => [
  `--device-orientation: ${dimensions.value?.orientation}`,
  `--device-width: ${deviceWidth.value}px`,
  `--device-height: ${deviceHeight.value}px`,
  `--header-height: ${headerHeight.value}px`,
  `--header-bg: ${headerBg.value}`,
  `--header-color: ${headerColor.value}`,
  `--view-height: ${viewHeight.value}px`,
  `--view-width: ${viewWidth.value}px`,
  `--canvas-bg: ${canvasBg.value}`,
  `--bezel-bg: ${bezelBg.value}`,
  `--bezel-width: ${bezelWidth.value}px`,
  `--bezel-radius: ${bezelRadius.value}px`,
])

const dataAttributes = computed(() => ({
  'data-device-orientation': dimensions.value?.orientation,
  'data-device-height': deviceHeight.value,
  'data-device-width': deviceWidth.value,
  'data-header-height': headerHeight.value,
  'data-view-height': viewHeight.value,
  'data-view-width': viewWidth.value,
}))
</script>

<template>
  <div
    :style
    v-bind="dataAttributes"
    class="group/device @container/device w-(--device-width) h-(--device-height) box-content bg-(--canvas-bg) border-(length:--bezel-width) border-(color:--bezel-bg) rounded-(--bezel-radius)"
  >
    <slot />
  </div>
</template>
