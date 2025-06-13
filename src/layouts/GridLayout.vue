<script setup lang="ts">
import MenuItemCard from '@/components/MenuItemCard.vue'
import useConfiguration from '@/composables/useConfiguration'
import type { Venue } from '@/composables/useMenu'
import { computed } from 'vue'

interface Props {
  venue?: Venue
}

const { venue } = defineProps<Props>()

const { orientation } = useConfiguration()

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
  <div
    :class="{
      'grid-cols-1': cols === 1,
      'grid-cols-2': cols === 2,
      'grid-cols-3': cols === 3,
      'grid-cols-4': cols === 4,
      'grid-cols-5': cols === 5,
      // 'grid-rows-1': rows === 1 && orientation === 'landscape',
      // 'grid-rows-2': rows === 2 && orientation === 'landscape',
      // 'grid-rows-3': orientation === 'portrait',
    }"
    class="p-4 h-full overflow-auto grid auto-rows-fr gap-4"
  >
    <MenuItemCard v-for="item in menuItems" :key="item.name" :item />
  </div>
</template>
