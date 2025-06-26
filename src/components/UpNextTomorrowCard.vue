<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import InfoCard from './InfoCard.vue'
import useMenuData, { type Venue } from '@/composables/useMenuData'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigurationStore } from '@/stores/configurationStore'
import { isBefore } from '@/functions/time'

const { menus } = storeToRefs(useConfigurationStore())

const date = Temporal.Now.plainDateISO().add({ days: 1 })
const time = Temporal.PlainTime.from('00:00')

const { menu } = useMenuData(date)

const upcomingMenu = computed(() => menus.value?.find((menu) => isBefore(time, menu.startTime)))

const validVenues = computed(() => {
  return menu.value?.venues.filter((venue) => venue.name !== 'No Venues Found')
})

const upcomingVenue = computed((): Venue | undefined => {
  if (!validVenues.value) return

  for (const venue of validVenues.value) {
    if (venue.name === upcomingMenu.value?.venueName?.apiName) return venue
  }
})

const startsAt = computed(() => {
  if (!upcomingMenu.value) return

  return Temporal.PlainTime.from(upcomingMenu.value.startTime).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
})
const endsAt = computed(() => {
  if (!upcomingMenu.value) return

  return Temporal.PlainTime.from(upcomingMenu.value.endTime).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    hourCycle: 'h12',
  })
})
</script>

<template>
  <div class="grid h-full place-content-center w-full">
    <InfoCard :title="date.toLocaleString(undefined, { weekday: 'long' })">
      <div v-if="menu">
        <p>Here's a peek at what's on the menu tomorrow!</p>
        <div>
          <span class="text-gray-600 text-sm">{{ startsAt }} - {{ endsAt }}</span>
          <h4 class="text-2xl font-semibold">{{ upcomingMenu?.venueName?.apiName }}</h4>
        </div>
        <ul>
          <li
            v-for="item in upcomingVenue?.items"
            :key="item.id"
            class="list-disc list-inside pl-4 accent-(--secondary-color)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div v-else>No menu available for tomorrow</div>
    </InfoCard>
  </div>
</template>
