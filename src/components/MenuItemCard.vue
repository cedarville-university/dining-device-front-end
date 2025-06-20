<script setup lang="ts">
import type { MenuItem } from '@/composables/useMenu'
import Allergen from '@/components/Allergen.vue'
import { computed } from 'vue'

interface Props {
  item: MenuItem
}

const { item } = defineProps<Props>()

const allergenCount = computed(() => item.allergens.length)
</script>

<template>
  <div
    class="group/menu-item @container/menu-item text-center grid grid-rows-[1fr_3fr] h-full bg-white rounded-lg shadow"
  >
    <h3 class="text-2xl font-semibold p-2 place-content-center">{{ item.name }}</h3>
    <div
      class="group/allergens @container/allergens overflow-clip grid grid-cols-2 grid-rows-2 gap-1 p-2 @sm/menu-item:w-sm @sm/menu-item:mx-auto"
    >
      <Allergen v-for="allergen in item.allergens" :key="allergen" :allergen />
    </div>
  </div>
</template>
