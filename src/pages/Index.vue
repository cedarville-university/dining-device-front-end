<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import Spinner from '@/components/icons/Spinner.vue'
import PageHeader from '@/components/PageHeader.vue'
import useConfiguration from '@/composables/useConfiguration'
import useMenu, { type Venue } from '@/composables/useMenu'
import { ChevronLeftIcon, ChevronRightIcon, Cog6ToothIcon } from '@heroicons/vue/20/solid'
import { Temporal } from 'temporal-polyfill'
import { computed, defineAsyncComponent, ref } from 'vue'

const { activeMenu, upcomingMenu, layout } = useConfiguration()

const layoutComponent = computed(() => {
  if (!layout.value) return undefined

  return defineAsyncComponent(() => import(`../layouts/${layout.value?.component}.vue`))
})

const date = ref(Temporal.Now.plainDateISO())
const prev = () => (date.value = date.value.subtract({ days: 1 }))
const next = () => (date.value = date.value.add({ days: 1 }))

const { menu, loading } = useMenu(date)

const activeVenue = computed((): Venue | undefined => {
  if (!menu.value?.venues) return

  for (const venue of menu.value?.venues) {
    if (venue.name === activeMenu.value?.name) return venue
  }
})

const inFullScreen = ref(false)
const enterFullscreen = () => {
  document.documentElement.requestFullscreen()
  inFullScreen.value = true
}
const exitFullscreen = () => {
  document.exitFullscreen()
  inFullScreen.value = false
}
</script>

<template>
  <PageHeader :title="activeVenue?.name ?? ''">
    <Spinner v-if="loading" class="text-white" />
    <AppButton to="/config/menus">
      <Cog6ToothIcon class="size-6" />
    </AppButton>
    <AppButton v-if="!inFullScreen" @click="enterFullscreen"> Enter Fullscreen </AppButton>
    <AppButton v-else @click="exitFullscreen"> Exit Fullscreen </AppButton>
    <AppButton @click="prev">
      <ChevronLeftIcon class="size-6" />
    </AppButton>
    <div class="text-white text-center rounded bg-white/15 p-2 w-25 border border-white/15">
      {{ date.toLocaleString() }}
    </div>
    <AppButton @click="next">
      <ChevronRightIcon class="size-6" />
    </AppButton>
  </PageHeader>
  <div
    v-if="!loading"
    class="group/content @container/content h-(--view-height) w-(--view-width) overflow-auto overscroll-contain"
  >
    <div v-if="!activeVenue" class="font-bold grid h-full place-content-center text-2xl w-full">
      0 active venue
    </div>
    <component v-if="activeVenue" :is="layoutComponent" :venue="activeVenue" />
    <pre v-else>{{ upcomingMenu }}</pre>
  </div>
</template>
