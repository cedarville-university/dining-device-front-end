<script setup lang="ts">
import Spinner from '@/components/icons/Spinner.vue'
import PageHeader from '@/components/PageHeader.vue'
import useConfiguration from '@/composables/useConfiguration'
import useMenu, { type Venue } from '@/composables/useMenu'
import type { TMenu } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAndCache as pioneerFetchAndCache } from '@/functions/pioneerMenu'

const router = useRouter()

const props = defineProps<{
  date?: string
}>()

const { allMenus, layout, auth } = useConfiguration()

const nowTime = ref(Temporal.Now.plainTimeISO())
const activeMenu = computed(() => {
  const now = nowTime.value.toString()

  return allMenus.value?.find((menu) => {
    const startTime = Temporal.PlainTime.from(menu.startTime)
    const endTime = Temporal.PlainTime.from(menu.endTime)
    return (
      Temporal.PlainTime.compare(now, startTime) !== -1 &&
      Temporal.PlainTime.compare(endTime, now) !== -1
    )
  })
})

const upcomingMenu = computed(() => {
  const now = nowTime.value.toString()

  return allMenus.value?.find((menu) => {
    const startTime = Temporal.PlainTime.from(menu.startTime)
    return Temporal.PlainTime.compare(now, startTime) === -1
  })
})

const refreshRate = ref(5)
let timeout = 0
const handleReload = () => {
  nowTime.value = Temporal.Now.plainTimeISO()
  timeout = setTimeout(handleReload, refreshRate.value * 1000)
}
onMounted(() => {
  const now = Temporal.Now.plainTimeISO()
  let secondsUntilFive = 0
  while ((now.second + secondsUntilFive) % refreshRate.value > 0) {
    secondsUntilFive++
  }

  timeout = setTimeout(handleReload, secondsUntilFive * 1000)
})
onUnmounted(() => {
  clearTimeout(timeout)
  exitFullscreen()
})

const layoutComponent = computed(() => {
  if (!layout.value) return undefined

  return defineAsyncComponent(() => import(`../layouts/${layout.value?.component}.vue`))
})

const date = computed(() =>
  props.date ? Temporal.PlainDate.from(props.date) : Temporal.Now.plainDateISO(),
)

const { fetchMenu, loading } = useMenu(date)
const menu = ref<TMenu>()
onMounted(() => fetchMenu(date.value.toString()))

const fetchAndCache = () => {
  requestIdleCallback(async () => {
    const data = await fetchMenu(date.value.toString())
    if (data) menu.value = data

    Promise.all([
      pioneerFetchAndCache(date.value.add({ days: 1 }).toString()),
      pioneerFetchAndCache(date.value.add({ days: 2 }).toString()),
      pioneerFetchAndCache(date.value.add({ days: 3 }).toString()),
      pioneerFetchAndCache(date.value.add({ days: 4 }).toString()),
      pioneerFetchAndCache(date.value.add({ days: 5 }).toString()),
      pioneerFetchAndCache(date.value.add({ days: 6 }).toString()),
      pioneerFetchAndCache(date.value.add({ days: 7 }).toString()),
    ])

    setTimeout(fetchAndCache, 6 * 60 * 60 * 1000)
  })
}
onMounted(fetchAndCache)

const validVenues = computed(() => {
  return menu.value?.venues.filter((venue) => venue.name !== 'No Venues Found')
})
const activeVenue = computed((): Venue | undefined => {
  if (!validVenues.value) return

  for (const venue of validVenues.value) {
    if (venue.name === activeMenu.value?.venueName?.apiName) return venue
  }
})

const exitFullscreen = () => {
  if (document.fullscreenElement) document.exitFullscreen()
}

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
</script>

<template>
  <PageHeader :title="activeVenue?.name ?? ''">
    <Spinner v-if="loading" />
    <div
      class="text-center rounded p-2 w-50 bg-(--header-color)/10 border border-(--header-color)/12"
    >
      {{ date.toLocaleString() }}
      {{ nowTime.toLocaleString() }}
    </div>
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
        <h4 class="text-2xl font-semibold">{{ upcomingMenu.venueName?.apiName }}</h4>
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
