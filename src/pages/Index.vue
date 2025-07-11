<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import Card from '@/components/Card.vue'
import FormSelect from '@/components/FormSelect.vue'
import Spinner from '@/components/icons/Spinner.vue'
import PageHeader from '@/components/PageHeader.vue'
import useIdleTimeout from '@/composables/useIdleTimeout'
import useMenuData from '@/composables/useMenuData'
import { useConfigurationStore } from '@/stores/configurationStore'
import { useLayoutsStore } from '@/stores/layoutsStore'
import {
  ArrowRightEndOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/20/solid'
import { storeToRefs } from 'pinia'
import { Temporal } from 'temporal-polyfill'
import { computed, defineAsyncComponent, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  date?: string
}>()

const date = computed(() =>
  props.date ? Temporal.PlainDate.from(props.date) : Temporal.Now.plainDateISO(),
)

const { venues, loading, error } = useMenuData(date)
const { menus, layout } = storeToRefs(useConfigurationStore())

const router = useRouter()
const prev = () =>
  router.push({ name: 'home', params: { date: date.value.subtract({ days: 1 }).toString() } })
const next = () =>
  router.push({ name: 'home', params: { date: date.value.add({ days: 1 }).toString() } })

// handles venue select
const venueOptions = computed(() => {
  return (
    venues.value?.map((venue) => {
      return {
        value: venue.name,
        label: venue.name,
      }
    }) ?? []
  )
})
const selectedVenueName = ref()
watch(venues, () => (selectedVenueName.value = venues.value?.[0].name))

const scheduledMenu = computed(() =>
  menus.value?.find((menu) => menu.venue?.name === selectedVenueName.value),
)

const selectedVenue = computed(() => {
  if (selectedVenueName.value) {
    return venues.value?.find((venue) => venue.name === selectedVenueName.value)
  }

  selectedVenueName.value = venues.value?.[0]?.name
  return venues.value?.[0]
})

// handles layout changes
const { layouts } = storeToRefs(useLayoutsStore())
const layoutOptions = computed(
  () => layouts.value?.map((layout) => ({ value: layout.component, label: layout.name })) ?? [],
)
const selectedLayoutComponent = ref()
watch(
  [layouts, selectedVenue],
  () =>
    (selectedLayoutComponent.value =
      scheduledMenu.value?.layout.component || layouts.value?.[0].component),
)
const layoutComponent = computed(() => {
  if (!selectedLayoutComponent.value) return
  return defineAsyncComponent(() => import(`../layouts/${selectedLayoutComponent.value}.vue`))
})

const enterKiosk = () => {
  router.push({ name: 'kiosk' })
}

// enter the kiosk after an idle period of 10 minutes
useIdleTimeout(() => router.replace({ name: 'kiosk' }), 10 * 60 * 60 * 1000)
</script>

<template>
  <PageHeader>
    <template #title>
      <div class="flex items-center gap-2 text-xs">
        <FormSelect
          label="Venues"
          :help="
            scheduledMenu
              ? `${scheduledMenu?.startTimeObject.toLocaleString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })} - ${scheduledMenu?.endTimeObject.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}`
              : undefined
          "
          :options="venueOptions"
          v-model="selectedVenueName"
          class="min-w-50"
        />
        <FormSelect label="Layouts" :options="layoutOptions" v-model="selectedLayoutComponent" />
      </div>
    </template>
    <Spinner v-if="loading" />
    <AppButton @click="enterKiosk" variant="secondary" class="flex gap-1 items-center">
      <ArrowRightEndOnRectangleIcon class="size-5" />
      Enter Kiosk
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
    <component
      v-if="!error && selectedVenue"
      :is="layoutComponent"
      :venue="selectedVenue"
      :with-header="false"
    />
    <div v-else class="grid place-content-center min-h-(--view-height)">
      <Card title="Something went wrong" class="m-8 min-w-lg text-center">
        <p>
          {{ error }}
        </p>
      </Card>
    </div>
  </div>
</template>
