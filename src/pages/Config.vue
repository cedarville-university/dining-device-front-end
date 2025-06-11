<script setup lang="ts">
import Card from '@/components/Card.vue'
import useConfiguration from '@/composables/useConfiguration'
import usePioneerMenu from '@/composables/usePioneerMenu'

const { allMenus, activeMenus } = useConfiguration()
const { menuData, date, venues, loading } = usePioneerMenu()
</script>

<template>
  <Card title="Menu Date">
    <p>{{ date }}</p>
  </Card>

  <Card title="Venues">
    <h2 class="font-semibold">Venues</h2>
    <ul>
      <li v-for="venue in venues" :key="venue.venue_name">{{ venue.venue_name }}</li>
    </ul>
  </Card>

  <Card title="Menu Items">
    <ul class="space-y-4">
      <li v-for="venue in venues" :key="venue.venue_name">
        <h3 class="text-md mb-2">{{ venue.venue_name }}</h3>
        <span v-if="typeof venue.menu_items === 'string'">{{ venue.menu_items }}</span>
        <ul
          v-else
          v-for="menuItem in venue.menu_items"
          :key="menuItem.item_name"
          class="px-2 before:content-['-'] before:pr-2"
        >
          {{
            menuItem.item_name
          }}
        </ul>
      </li>
    </ul>
  </Card>

  <Card title="Raw Data">
    <pre>{{ menuData }}</pre>
  </Card>
</template>
