<script setup lang="ts">
import MenuItemCard from '@/components/MenuItemCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import type { LayoutProps } from '@/components/types'
import { useConfigurationStore } from '@/stores/configurationStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { venue, withHeader = true } = defineProps<LayoutProps>()
const { orientation } = storeToRefs(useConfigurationStore())

const menuItems = computed(() => {
  if (venue) {
    return venue.items
  }
  return []
})
const itemCount = computed(() => menuItems.value.length)

const cols = computed(() => {
  if (orientation.value === 'landscape') {
    if (itemCount.value > 8) return 5
    if (itemCount.value > 6) return 4
    if (itemCount.value > 4) return 3
    if (itemCount.value > 1) return 2
    return 1
  } else {
    if (itemCount.value > 6) return 3
    if (itemCount.value > 3) return 2
    return 1
  }
})
const rows = computed(() => {
  if (itemCount.value > 2) return 2
  return 1
})
</script>

<template>
  <PageHeader v-if="withHeader" :title="venue.name">
    <template v-if="$slots.headerTitle" #title>
      <slot name="headerTitle" />
    </template>
    <slot v-if="$slots.headerAction" name="headerAction" />
  </PageHeader>
  <div
    class="group/content @container/content h-(--view-height) w-(--view-width) overflow-auto overscroll-contain"
  >
    <div
      :class="{
        'grid-cols-1': cols === 1,
        'grid-cols-2': cols === 2,
        'grid-cols-3': cols === 3,
        'grid-cols-4': cols === 4,
        'grid-cols-5': cols === 5,
      }"
      class="p-4 h-full overflow-auto grid auto-rows-fr gap-4"
    >
      <MenuItemCard v-for="item in menuItems" :key="item.name" :item />
    </div>
  </div>
</template>
