<script setup lang="ts">
import Spinner from '@/components/icons/Spinner.vue'
import PageHeader from '@/components/PageHeader.vue'
import useConfiguration from '@/composables/useConfiguration'
import useMenu, { type Venue } from '@/composables/useMenu'
import { Temporal } from 'temporal-polyfill'
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  date?: string
}>()

const { activeMenu, upcomingMenu, layout, auth } = useConfiguration()

let timeout = 0
const handleReload = () => {
  router.replace({ name: 'kiosk', params: { date: props.date } })
  timeout = setTimeout(handleReload, 5000)
}
onMounted(() => {
  timeout = setTimeout(handleReload, 5000)
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

const { menu, loading } = useMenu(date)

const activeVenue = computed((): Venue | undefined => {
  if (!menu.value?.venues) return

  for (const venue of menu.value?.venues) {
    if (venue.name === activeMenu.value?.name) return venue
  }
})

const exitFullscreen = () => {
  if (document.fullscreenElement) document.exitFullscreen()
}

let kioskPin = ''
let timeoutId = 0
const pinEnter = (num: '1' | '2' | '3' | '4') => {
  if (timeoutId) clearTimeout(timeoutId)
  kioskPin += num

  if (kioskPin === auth.value?.kiosk) {
    router.replace({ name: 'home' })
  }

  timeoutId = setTimeout(() => {
    kioskPin = ''
  }, 750)
}
</script>

<template>
  <PageHeader :title="activeVenue?.name ?? ''">
    <Spinner v-if="loading" />
    <div
      class="text-center rounded p-2 w-25 bg-(--header-color)/10 border border-(--header-color)/12"
    >
      {{ date.toLocaleString() }}
    </div>
  </PageHeader>
  <div
    v-if="!loading"
    class="group/content @container/content h-(--view-height) w-(--view-width) overflow-auto overscroll-contain"
  >
    <div v-if="!activeVenue" class="font-bold grid h-full place-content-center text-2xl w-full">
      0 active venue
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
  </div>
</template>
