<script setup lang="ts">
import useConfiguration from '@/composables/useConfiguration'
import usePioneerMenu from '@/composables/usePioneerMenu'
import { LoaderCircle } from 'lucide-vue-next'

const { allMenus, activeMenus } = useConfiguration()
const { menuData, date, venues, loading } = usePioneerMenu()
</script>

<template>
  <div style="--header-height: 75px">
    <header
      class="px-4 p-1 flex items-center justify-between h-(--header-height) shadow bg-primary"
    >
      <h1 class="text-white">Menu Data</h1>
      <LoaderCircle v-if="loading" class="animate-spin text-white" />
    </header>
    <div
      class="p-4 overflow-scroll h-[calc(var(--device-height)-var(--header-height))] overscroll-contain space-y-4"
    >
      <div class="bg-white border rounded p-4 space-y-2">
        <h2 class="font-semibold">Device Setup</h2>
        {{ activeMenus }}
        <ul>
          <li v-for="station in allMenus" :key="station.name + station.startTime + station.endTime">
            {{ station.name }} ({{ station.startTime }} - {{ station.endTime }})
          </li>
        </ul>
      </div>
      <div class="bg-white border rounded p-4 space-y-2">
        <h2 class="font-semibold">Menu Date</h2>
        <p>{{ date }}</p>
      </div>

      <div class="bg-white border rounded p-4 space-y-2">
        <h2 class="font-semibold">Venues</h2>
        <ul>
          <li v-for="venue in venues" :key="venue.venue_name">{{ venue.venue_name }}</li>
        </ul>
      </div>

      <div class="bg-white border rounded p-4 space-y-2">
        <h2 class="font-semibold">Menu Items</h2>
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
      </div>

      <div class="bg-white border rounded p-4 space-y-2">
        <h2 class="font-semibold">Raw Data</h2>
        <pre>{{ menuData }}</pre>
      </div>
    </div>
  </div>
</template>
