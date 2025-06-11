<script setup lang="ts">
import Card from '@/components/Card.vue'
import VenueCard from '@/components/VenueCard.vue'
import useConfiguration from '@/composables/useConfiguration'
import usePioneerMenu, { type PioneerVenue } from '@/composables/usePioneerMenu'
import { LoaderCircle } from 'lucide-vue-next'
import { Temporal } from 'temporal-polyfill'

const { allMenus, activeMenus } = useConfiguration()
const { date, venues, loading } = usePioneerMenu()

const getVenue = (venueName: string): PioneerVenue | undefined =>
  venues.value?.find((venue) => venue.venue_name === venueName)
</script>

<template>
  <div style="--header-height: 75px">
    <header
      class="px-4 p-1 flex items-center justify-between h-(--header-height) shadow bg-primary"
    >
      <h1 class="text-white">Menu Data</h1>

      <div class="flex gap-1 items-center">
        <LoaderCircle v-if="loading" class="animate-spin text-white" />
        <span class="text-white">{{ Temporal.Now.plainDateISO().toLocaleString() }}</span>
      </div>
    </header>
    <div
      class="p-4 overflow-scroll h-[calc(var(--device-height)-var(--header-height))] overscroll-contain space-y-4"
    >
      <Card title="Device Setup">
        <h3>All Menus</h3>
        <ul>
          <li v-for="station in allMenus" :key="station.name + station.startTime + station.endTime">
            {{ station.name }} ({{ station.startTime }} - {{ station.endTime }})
          </li>
        </ul>

        <h3>Active Menus</h3>
        <ul>
          <li
            v-for="station in activeMenus"
            :key="station.name + station.startTime + station.endTime"
          >
            {{ station.name }} ({{ station.startTime }} - {{ station.endTime }})
          </li>
        </ul>
      </Card>

      <VenueCard
        v-for="menu in activeMenus"
        :key="menu.name + menu.startTime + menu.endTime"
        :venue="getVenue(menu.name)!"
      />
    </div>
  </div>
</template>
