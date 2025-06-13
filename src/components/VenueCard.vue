<script setup lang="ts">
import Card from './Card.vue'
import { allergenLabels } from '@/functions/allergenLabels'
import type { Venue } from '@/composables/useMenuData'
import { computed } from 'vue'
import useConfiguration from '@/composables/useConfiguration'

interface Props {
  venue?: Venue
}

const { orientation } = useConfiguration()
const { venue } = defineProps<Props>()

const cardWidth = computed(() => {
  if (!venue?.items) return

  if (orientation.value === 'portrait') {
    // 5 x 2
    if (venue?.items.length > 9) {
      return `w-[calc(var(--view-width)/3-var(--spacing)*6)]`
    }

    // 4 x 2
    if (venue?.items.length > 4) {
      return `w-[calc(var(--view-width)/3-var(--spacing)*6)]`
    }

    return `w-[calc(var(--view-width)/2-var(--spacing)*6)]`
  }

  // 5 x 2
  if (venue?.items.length > 8) {
    return `w-[calc(var(--view-width)/5-var(--spacing)*5)]`
  }

  // 4 x 2
  if (venue?.items.length > 4) {
    return `w-[calc(var(--view-width)/4-var(--spacing)*5)]`
  }

  return `w-[calc(var(--view-width)/2-var(--spacing)*6)]`
})
</script>

<template>
  <div v-if="venue" class="max-h-(--view-height) overflow-y-auto" style="--h-height: 32px">
    <h2 class="font-semibold text-2xl my-2 px-4">{{ venue.name }}</h2>
    <ul
      class="flex flex-wrap gap-4 w-(--view-width) h-[calc(var(--view-height)-var(--h-height)-var(--spacing)*4)] overflow-x-auto no-scrollbar p-4 overscroll-contain"
    >
      <li
        v-for="menuItem in venue?.items"
        :key="menuItem.name"
        class="bg-white rounded-lg shadow shrink-0 h-[calc(50%-var(--spacing)*4)]"
        :class="cardWidth"
      >
        <div class="text-center grid grid-rows-[1fr_3fr] h-full">
          <h3 class="text-2xl font-semibold py-2 place-content-center">
            {{ menuItem.name }}
          </h3>
          <ul
            v-if="menuItem.allergens"
            class="@container/allergens gap-2 my-auto bg-white"
            :class="{
              'flex flex-wrap items-center justify-center': orientation === 'landscape',
              'flex flex-col items-center justify-center': orientation === 'portrait',
            }"
          >
            <li
              v-for="allergen in menuItem.allergens"
              :key="allergen"
              :class="{
                'flex-1/3': orientation === 'landscape',
                'w-full': orientation === 'portrait',
              }"
              class="@sm/allergens:flex-1"
            >
              <figure
                class="flex gap-2"
                :class="{
                  'flex-col items-center': orientation === 'landscape',
                  'items-center pl-4': orientation === 'portrait',
                }"
              >
                <img :src="allergen" class="size-16" />
                <figcaption class="wrap-anywhere text-pretty">
                  {{ allergenLabels.get(allergen) }}
                </figcaption>
              </figure>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>
