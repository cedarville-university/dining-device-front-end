<script setup lang="ts">
interface Props {
  width: number
  height: number
}

defineProps<Props>()
</script>

<template>
  <div
    class="grid place-content-center"
    :style="[`--device-width: ${width}px`, `--device-height: ${height}px`]"
    style="--header-height: 75px"
  >
    <div
      class="w-(--device-width) h-(--device-height) border-80 border-black rounded-[45px] box-content bg-gray-100"
    >
      <header
        class="px-4 p-1 flex items-center justify-between h-(--header-height) shadow bg-primary"
      >
        <h1 class="text-white">Menu Data</h1>
      </header>
      <div
        class="p-4 overflow-scroll h-[calc(var(--device-height)-var(--header-height))] overscroll-contain space-y-4"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
