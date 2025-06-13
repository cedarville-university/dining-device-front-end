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
      class="group/allergens @container/allergens grid gap-2 my-auto"
      :class="{
        'grid-cols-1 grid-rows-1': allergenCount === 1,
        'grid-cols-2 grid-rows-1': allergenCount === 2,
        '@sm/menu-item:grid-cols-3 @sm/menu-item:grid-rows-1 grid-cols-2 grid-rows-2':
          allergenCount === 3,
        'grid-cols-2 grid-rows-2': allergenCount >= 4,
      }"
    >
      <Allergen v-for="allergen in item.allergens" :key="allergen" :allergen />
    </div>
  </div>
</template>
