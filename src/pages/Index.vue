<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import Spinner from '@/components/icons/Spinner.vue'
import PageHeader from '@/components/PageHeader.vue'
import useConfiguration from '@/composables/useConfiguration'
import useMenu, { type Venue } from '@/composables/useMenu'
import { db } from '@/db'
import {
  ArrowRightEndOnRectangleIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/20/solid'
import { Temporal } from 'temporal-polyfill'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  date?: string
}>()

const router = useRouter()

const { allMenus, activeMenu, upcomingMenu, layout } = useConfiguration()

const layoutComponent = computed(() => {
  if (!layout.value) return undefined

  return defineAsyncComponent(() => import(`../layouts/${layout.value?.component}.vue`))
})

const date = computed(() =>
  props.date ? Temporal.PlainDate.from(props.date) : Temporal.Now.plainDateISO(),
)
const prev = () =>
  router.push({ name: 'home', params: { date: date.value.subtract({ days: 1 }).toString() } })
const next = () =>
  router.push({ name: 'home', params: { date: date.value.add({ days: 1 }).toString() } })

const { menu, loading } = useMenu(date)

const validVenues = computed(() => {
  return menu.value?.venues.filter((venue) => venue.name !== 'No Venues Found')
})

const activeVenue = computed((): Venue | undefined => {
  if (!validVenues.value) return

  for (const venue of validVenues.value) {
    if (venue.name === activeMenu.value?.venueName?.apiName) return venue
  }
})

const inFullScreen = ref(false)

const enterFullscreen = () => {
  if (!inFullScreen.value) {
    inFullScreen.value = true
    document.documentElement.requestFullscreen()
  }
}
const exitFullscreen = () => {
  if (inFullScreen.value) {
    inFullScreen.value = false
    document.exitFullscreen()
  }
}

const enterKiosk = () => {
  enterFullscreen()
  router.push({ name: 'kiosk', params: { date: date.value.toString() } })
}
</script>

<template>
  <PageHeader :title="activeVenue?.name ?? ''">
    <Spinner v-if="loading" />
    <AppButton @click="enterKiosk" variant="secondary" class="flex gap-1 items-center">
      <ArrowRightEndOnRectangleIcon class="size-5" />
      Enter Kiosk
    </AppButton>
    <AppButton v-if="!inFullScreen" @click="enterFullscreen" variant="secondary">
      <ArrowsPointingOutIcon class="size-6" />
      <span class="sr-only">Enter Fullscreen</span>
    </AppButton>
    <AppButton v-else @click="exitFullscreen">
      <ArrowsPointingInIcon class="size-6" />
      <span class="sr-only">Exit Fullscreen</span>
    </AppButton>
    <AppButton to="/config" variant="secondary">
      <Cog6ToothIcon class="size-6" />
      <span class="sr-only">Enter Configuration</span>
    </AppButton>
    <AppButton @click="prev">
      <ChevronLeftIcon class="size-6" />
      <span class="sr-only">Previous Day</span>
    </AppButton>
    <div
      class="text-center rounded p-2 w-25 bg-(--header-color)/10 border border-(--header-color)/12"
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
    <div v-if="!activeVenue" class="grid h-full place-content-center w-full">
      <div
        v-if="validVenues?.length && upcomingMenu"
        class="bg-white rounded-md shadow p-8 space-y-4"
      >
        <h4 class="text-2xl font-semibold">{{ upcomingMenu.venueName?.name }}</h4>
        <div>
          The next menu starts at
          <strong>{{ Temporal.PlainTime.from(upcomingMenu.startTime).toLocaleString() }}</strong>
        </div>
      </div>
      <div v-else class="bg-white rounded-md shadow p-8">
        No upcoming menus. Check back tomorrow.
      </div>
    </div>
    <component v-if="activeVenue" :is="layoutComponent" :venue="activeVenue" />
  </div>
</template>
