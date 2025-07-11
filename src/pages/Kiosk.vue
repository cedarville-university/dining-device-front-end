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
import { isBefore, isBetween } from '@/functions/time'
import UpNextCard from '@/components/UpNextCard.vue'
import UpNextTomorrowCard from '@/components/UpNextTomorrowCard.vue'
import { useWindowEvent } from '@/composables/useWindowEvent'

const router = useRouter()

const { menus, auth } = storeToRefs(useConfigurationStore())

// this starts a scheduled refresh of the current time based
// on the configured layout refresh rate. This will pickup changes
// from one menu to the next in the UI
const { time: nowTime } = useScheduledTimeSync()

// start pioneer background fetch
// defaults to fetching the next 7 days
// every 6 hours
usePioneerFetchAndCache(7)

// this starts a scheduled sync of the menu data stored
// in the localdb for the current date. If the menu
// doesn't exist, pioneer will be fetched
const { data: menu, loading } = useScheduledMenuSync()

const activeMenu = computed(() =>
  menus.value?.find((menu) => isBetween(nowTime.value, menu.startTime, menu.endTime)),
)

const layoutComponent = computed(() => {
  if (!activeMenu.value) return undefined

  return defineAsyncComponent(() => import(`../layouts/${activeMenu.value?.layout.component}.vue`))
})

const upcomingMenu = computed(() =>
  menus.value?.find((menu) => isBefore(nowTime.value, menu.startTime)),
)

const activeVenue = computed((): Venue | undefined =>
  menu.value?.venues.find((venue) => venue.name === activeMenu.value?.venue.apiName),
)

const upcomingVenue = computed((): Venue | undefined =>
  menu.value?.venues.find((venue) => venue.name === upcomingMenu.value?.venue.apiName),
)

let kioskPin = ref('')
let timeoutId = 0
const pinEnter = (num: '1' | '2' | '3' | '4') => {
  if (timeoutId) clearTimeout(timeoutId)
  kioskPin.value += num

  if (kioskPin.value === auth.value?.kiosk) {
    router.replace({ name: 'home' })
  } else if (kioskPin.value.length === 4) {
    kioskPin.value = ''
  } else {
    timeoutId = setTimeout(() => {
      kioskPin.value = ''
    }, 750)
  }
}

useWindowEvent('keydown', (e) => {
  if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
    pinEnter(e.key)
  }
})
</script>

<template>
  <div class="absolute w-full h-full">
    <component v-if="activeVenue" :is="layoutComponent" :venue="activeVenue">
      <template #headerAction>
        <Spinner v-if="loading" />
        <div
          class="text-center rounded px-3 py-2 w-50 bg-(--header-color)/10 border border-(--header-color)/12"
        >
          {{ Temporal.Now.plainDateISO().toLocaleString() }} {{ nowTime.toLocaleString() }}
        </div>
      </template>
    </component>
    <template v-else>
      <UpNextCard
        v-if="upcomingMenu && upcomingVenue"
        :menu="upcomingMenu"
        :venue="upcomingVenue"
      />
      <UpNextTomorrowCard v-else />
    </template>

    <div
      class="absolute z-100 inset-0 w-(--device-width) h-(--device-height) grid grid-cols-2 grid-rows-2 overscroll-contain"
    >
      <button @click="pinEnter('1')"></button>
      <button @click="pinEnter('2')"></button>
      <button @click="pinEnter('3')"></button>
      <button @click="pinEnter('4')"></button>

      <div class="absolute bottom-1 right-1 text-2xl font-bold">{{ kioskPin }}</div>
    </div>
  </div>
</template>
