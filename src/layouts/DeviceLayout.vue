<script setup lang="ts">
import type { TDeviceDimension } from '@/db'
import { computed } from 'vue'

defineSlots<{
  default(props: { deviceWidth: number; deviceHeight: number }): any
}>()

interface Props {
  deviceDimension: TDeviceDimension
  showBezels?: boolean
}
const { deviceDimension: dimensions, showBezels = false } = defineProps<Props>()

const style = computed(
  () =>
    `--device-width: ${dimensions.width}px; --device-height: ${dimensions.height}px; --device-orientation: ${dimensions.orientation}`,
)
</script>

<template>
  <div
    :style
    :class="{
      'border-80 border-black rounded-[45px]': showBezels,
    }"
    class="overflow-auto w-(--device-width) h-(--device-height) box-content bg-gray-100"
  >
    <div
      class="overflow-scroll h-[calc(var(--device-height)-var(--header-height))] overscroll-contain space-y-4"
    >
      <slot :deviceWidth="dimensions.width" :deviceHeight="dimensions.height" />
    </div>
  </div>
</template>
