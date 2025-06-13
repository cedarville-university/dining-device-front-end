<script setup lang="ts">
import Spinner from '@/components/icons/Spinner.vue'
import VenueCard from '@/components/VenueCard.vue'
import useConfiguration from '@/composables/useConfiguration'
import useMenuData, { type Menu, type Venue } from '@/composables/useMenuData'
import usePioneerMenu from '@/composables/usePioneerMenu'
import { Cog6ToothIcon } from '@heroicons/vue/20/solid'
import { Temporal } from 'temporal-polyfill'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'

const { activeMenus } = useConfiguration()

const date = ref(Temporal.Now.plainDateISO())
const prev = () => (date.value = date.value.subtract({ days: 1 }))
const next = () => (date.value = date.value.add({ days: 1 }))

const menu = ref<Menu>()
const { get } = useMenuData()
const { fetchAndStoreMenu } = usePioneerMenu()

const loading = ref(false)

watchEffect(async () => {
  try {
    menu.value = await get(date.value.toString())
    if (!menu.value) {
      loading.value = true
      menu.value = await fetchAndStoreMenu(date.value.toString())
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})

const activeVenues = computed(() => {
  const activeVenueNames = activeMenus.value?.map((m) => m.name)

  if (activeVenueNames && activeVenueNames.length > 0) {
    return menu.value?.venues.filter((v) => activeVenueNames.includes(v.name))
  }

  return []
})
</script>

<template>
  <div style="--header-height: 75px">
    <header
      class="px-4 p-1 flex items-center justify-between h-(--header-height) shadow bg-primary"
    >
      <h1 class="text-white">Menu Data</h1>

      <div class="flex gap-1 items-center">
        <Spinner v-if="loading" class="text-white" />
        <RouterLink :to="{ name: 'config' }" class="text-white px-2 py-1">
          <Cog6ToothIcon class="size-5" />
        </RouterLink>
        <div class="flex items-center border rounded text-white">
          <button class="px-2 py-1" @click="prev">Prev</button>
          <div class="text-white border-x px-2 py-1">
            {{ date.toLocaleString() }}
          </div>
          <button class="px-2 py-1" @click="next">Next</button>
        </div>
      </div>
    </header>
    <div
      v-if="!loading"
      class="h-[calc(var(--device-height)-var(--header-height))] overscroll-contain space-y-4"
      style="
        --view-width: calc(var(--device-width));
        --view-height: calc(var(--device-height) - var(--header-height));
      "
    >
      <div
        v-if="activeVenues?.length === 0"
        class="font-bold grid h-full place-content-center text-2xl w-full"
      >
        0 active venues
      </div>
      <VenueCard v-else v-for="venue in activeVenues" :key="venue.name" :venue />
    </div>
  </div>
</template>
