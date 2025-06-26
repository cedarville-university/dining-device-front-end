<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import Spinner from '@/components/icons/Spinner.vue'
import InfoCard from '@/components/InfoCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import UpNextCard from '@/components/UpNextCard.vue'
import UpNextTomorrowCard from '@/components/UpNextTomorrowCard.vue'
import useFullscreen from '@/composables/useFullscreen'
import useIdleTimeout from '@/composables/useIdleTimeout'
import useMenuData from '@/composables/useMenuData'
import { type Venue } from '@/composables/useMenuData'
import { isBefore, isBetween } from '@/functions/time'
import { useConfigurationStore } from '@/stores/configurationStore'
import {
  ArrowRightEndOnRectangleIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/20/solid'
import { storeToRefs } from 'pinia'
import { Temporal } from 'temporal-polyfill'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  date?: string
}>()

const router = useRouter()

const { menus, layout } = storeToRefs(useConfigurationStore())

const layoutComponent = computed(() => {
  if (!layout.value) return undefined

  return defineAsyncComponent(() => import(`../layouts/${layout.value?.component}.vue`))
})

const dateTime = computed(() =>
  props.date
    ? Temporal.PlainDateTime.from(props.date + ' ' + Temporal.Now.plainTimeISO().toString())
    : Temporal.Now.plainDateTimeISO(),
)
const date = computed(() => dateTime.value.toPlainDate())
const time = computed(() => dateTime.value.toPlainTime())

const prev = () =>
  router.push({ name: 'home', params: { date: date.value.subtract({ days: 1 }).toString() } })
const next = () =>
  router.push({ name: 'home', params: { date: date.value.add({ days: 1 }).toString() } })

const { menu, loading } = useMenuData(date)

const activeMenu = computed(() =>
  menus.value?.find((menu) => isBetween(time.value, menu.startTime, menu.endTime)),
)

const upcomingMenu = computed(() =>
  menus.value?.find((menu) => isBefore(time.value, menu.startTime)),
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

const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen()

const enterKiosk = () => {
  enterFullscreen()
  router.push({ name: 'kiosk' })
}

// enter the kiosk after an idle period of 1 minute
useIdleTimeout(() => router.replace({ name: 'kiosk' }), 60000)
</script>

<template>
  <PageHeader :title="activeVenue?.name ?? ''">
    <Spinner v-if="loading" />
    <AppButton @click="enterKiosk" variant="secondary" class="flex gap-1 items-center">
      <ArrowRightEndOnRectangleIcon class="size-5" />
      Enter Kiosk
    </AppButton>
    <AppButton v-if="isFullscreen" @click="exitFullscreen">
      <ArrowsPointingInIcon class="size-6" />
      <span class="sr-only">Exit Fullscreen</span>
    </AppButton>
    <AppButton v-else @click="enterFullscreen" variant="secondary">
      <ArrowsPointingOutIcon class="size-6" />
      <span class="sr-only">Enter Fullscreen</span>
    </AppButton>
    <AppButton :to="{ name: 'config' }" variant="secondary">
      <Cog6ToothIcon class="size-6" />
      <span class="sr-only">Enter Configuration</span>
    </AppButton>
    <AppButton @click="prev">
      <ChevronLeftIcon class="size-6" />
      <span class="sr-only">Previous Day</span>
    </AppButton>
    <div
      class="text-center rounded px-3 py-2 w-25 bg-(--header-color)/10 border border-(--header-color)/12"
    >
      {{ date.toLocaleString() }}
    </div>
    <AppButton @click="next">
      <ChevronRightIcon class="size-6" />
      <span class="sr-only">Next Day</span>
    </AppButton>
  </PageHeader>
  <div
    v-if="!loading"
    class="group/content @container/content h-(--view-height) w-(--view-width) overflow-auto overscroll-contain"
  >
    <component v-if="activeVenue" :is="layoutComponent" :venue="activeVenue" />
    <div v-else class="h-full grid place-content-center">
      <InfoCard v-if="validVenues?.length && upcomingMenu && upcomingVenue" title="Next up">
        <p>{{ upcomingMenu.venueName.name }}</p>
      </InfoCard>
      <InfoCard
        v-else
        :title="date.add({ days: 1 }).toLocaleString(undefined, { weekday: 'long' })"
      >
        <p>Check back tomorrow</p>
      </InfoCard>
    </div>
  </div>
</template>
