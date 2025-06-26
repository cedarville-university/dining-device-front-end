<script setup lang="ts">
import Spinner from '@/components/icons/Spinner.vue'
import PageHeader from '@/components/PageHeader.vue'
import { type Venue } from '@/composables/useMenuData'
import { Temporal } from 'temporal-polyfill'
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import usePioneerFetchAndCache from '@/composables/useScheduledPioneerMenuSync'
import useScheduledMenuSync from '@/composables/useScheduledMenuSync'
import useScheduledTimeSync from '@/composables/useScheduledTimeSync'
import { storeToRefs } from 'pinia'
import { useConfigurationStore } from '@/stores/configurationStore'
import useFullscreen from '@/composables/useFullscreen'
import { isBefore, isBetween } from '@/functions/time'
import UpNextCard from '@/components/UpNextCard.vue'
import UpNextTomorrowCard from '@/components/UpNextTomorrowCard.vue'

const router = useRouter()

const { menus, layout, auth } = storeToRefs(useConfigurationStore())

const layoutComponent = computed(() => {
  if (!layout.value) return undefined

  return defineAsyncComponent(() => import(`../layouts/${layout.value?.component}.vue`))
})

// this starts a scheduled refresh o fthe current time based
// on the configured layout refresh rate. This will pickup changes
// from one menu to the next in the UI
const { time: nowTime } = useScheduledTimeSync()

// this starts a scheduled sync of the menu data stored
// in the localdb for the current date. If the menu
// doesn't exist, pioneer will be fetched
const { data: menu, loading } = useScheduledMenuSync()

// start pioneer background fetch
// defaults to fetching the next 5 days
// every 6 hours
usePioneerFetchAndCache(5)

const activeMenu = computed(() =>
  menus.value?.find((menu) => isBetween(nowTime.value, menu.startTime, menu.endTime)),
)

const upcomingMenu = computed(() =>
  menus.value?.find((menu) => isBefore(nowTime.value, menu.startTime)),
)

const validVenues = computed(() => {
  return menu.value?.venues.filter((venue) => venue.name !== 'No Venues Found')
})

const activeVenue = computed((): Venue | undefined => {
  if (!validVenues.value) return

  for (const venue of validVenues.value) {
    if (venue.name === activeMenu.value?.venueName?.apiName) return venue
  }
})

const upcomingVenue = computed((): Venue | undefined => {
  if (!validVenues.value) return

  for (const venue of validVenues.value) {
    if (venue.name === upcomingMenu.value?.venueName?.apiName) return venue
  }
})

const { exitFullscreen } = useFullscreen()
let kioskPin = ref('')
let timeoutId = 0
const pinEnter = (num: '1' | '2' | '3' | '4') => {
  if (timeoutId) clearTimeout(timeoutId)
  kioskPin.value += num

  if (kioskPin.value === auth.value?.kiosk) {
    exitFullscreen()
    router.replace({ name: 'home' })
  } else if (kioskPin.value.length === 4) {
    kioskPin.value = ''
  } else {
    timeoutId = setTimeout(() => {
      kioskPin.value = ''
    }, 750)
  }
}
</script>

<template>
  <PageHeader :title="activeVenue?.name ?? ''">
    <Spinner v-if="loading" />
    <div
      class="text-center rounded px-3 py-2 w-50 bg-(--header-color)/10 border border-(--header-color)/12"
    >
      {{ Temporal.Now.plainDateISO().toLocaleString() }}
      {{ nowTime.toLocaleString() }}
    </div>
  </PageHeader>
  <div
    v-if="!loading"
    class="group/content @container/content h-(--view-height) w-(--view-width) overflow-auto overscroll-contain"
  >
    <component v-if="activeVenue" :is="layoutComponent" :venue="activeVenue" />
    <template v-else>
      <UpNextCard
        v-if="upcomingMenu && upcomingVenue"
        :menu="upcomingMenu"
        :venue="upcomingVenue"
      />
      <UpNextTomorrowCard v-else />
    </template>
  </div>

  <div
    class="absolute z-100 inset-0 w-(--device-width) h-(--device-height) grid grid-cols-2 grid-rows-2 overscroll-contain"
  >
    <button @click="pinEnter('1')"></button>
    <button @click="pinEnter('2')"></button>
    <button @click="pinEnter('3')"></button>
    <button @click="pinEnter('4')"></button>

    <div class="absolute bottom-1 right-1 text-2xl font-bold">{{ kioskPin }}</div>
  </div>
</template>
