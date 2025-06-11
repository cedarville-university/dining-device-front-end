<script setup lang="ts">
import type { PioneerVenue } from '@/composables/usePioneerMenu'
import Card from './Card.vue'
import { allergenLabels } from '@/functions/allergenLabels'

interface Props {
  venue: PioneerVenue
}

defineProps<Props>()
</script>

<template>
  <Card v-if="venue" :title="venue.venue_name">
    <template #header>
      <div>
        <h2 class="font-semibold text-xl">{{ venue.venue_name }}</h2>
      </div>
    </template>
    <template
      v-for="menuItem in venue?.menu_items"
      :key="typeof menuItem === 'string' ? menuItem : menuItem.item_name"
    >
      <span v-if="typeof menuItem === 'string'">{{ menuItem }}</span>
      <ul v-else>
        <li>
          <h3 class="text-xl">{{ menuItem.item_name }}</h3>
          <ul v-if="menuItem.allergens" class="flex flex-wrap items-center">
            <li v-for="allergen in menuItem.allergens" :key="allergen">
              <figure class="flex flex-col items-center gap-2">
                <img :src="allergen" class="size-32" />
                <figcaption>
                  {{ allergenLabels.get(allergen) }}
                </figcaption>
              </figure>
            </li>
          </ul>
        </li>
      </ul>
    </template>
  </Card>
</template>
