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

const upcomingVenue = computed((): Venue | undefined =>
  validVenues.value?.find((venue) => venue.name === upcomingMenu.value?.venue.name),
)

const startsAt = computed(() => {
  if (!upcomingMenu.value) return

  return upcomingMenu.value.startTimeObject.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
})
const endsAt = computed(() => {
  if (!upcomingMenu.value) return

  return upcomingMenu.value.endTimeObject.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    hourCycle: 'h12',
  })
})
</script>

<template>
  <div class="grid h-full place-content-center w-full">
    <InfoCard
      title="Tomorrow"
      :subtitle="`${date.toLocaleString(undefined, { weekday: 'long' })}, ${date.toLocaleString()}`"
    >
      <div v-if="upcomingVenue" class="space-y-4">
        <div>
          <span class="text-gray-600 text-sm">{{ startsAt }} - {{ endsAt }}</span>
          <h4 class="text-2xl font-semibold">{{ upcomingMenu?.venue?.apiName }}</h4>
        </div>
        <p>Here's a peek at what's on the menu tomorrow!</p>
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
      <div v-else class="space-y-4">
        <h4 class="text-2xl font-semibold">Menu unavailable</h4>
        <p>There is no menu data available for tomorrow.</p>
      </div>
    </InfoCard>
  </div>
</template>
