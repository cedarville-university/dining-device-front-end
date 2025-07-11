<script setup lang="ts">
import { type TConfigMenu } from '@/db'
import { PlusCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import { ref, useId } from 'vue'
import Alert from '@/components/Alert.vue'
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'
import PageTitle from '@/components/PageTitle.vue'
import { useConfigurationStore } from '@/stores/configurationStore'
import { storeToRefs } from 'pinia'
import { useVenueNamesStore } from '@/stores/venueNamesStore'
import { useLayoutsStore } from '@/stores/layoutsStore'
import { Temporal } from 'temporal-polyfill'
import FormGroup from '@/components/FormGroup.vue'
import FormSubmit from '@/components/FormSubmit.vue'
import { deepUnref } from '@/functions/deepUnref'

const configuration = useConfigurationStore()
const menus = ref<
  (TConfigMenu & {
    startTimeObject: Temporal.PlainTime
    endTimeObject: Temporal.PlainTime
  })[]
>(deepUnref(configuration.menus))
const { layouts } = storeToRefs(useLayoutsStore())

const addMenuItem = () => {
  if (!menus.value) menus.value = []
  if (!venueNames.value?.[0]) return
  if (!layouts.value) return

  menus.value = [
    {
      venue: {
        id: venueNames.value?.[0].id,
        name: venueNames.value?.[0].name,
        apiName: venueNames.value?.[0].apiName,
      },
      layout: layouts.value?.[0],
      startTime: '00:00',
      startTimeObject: Temporal.PlainTime.from('00:00'),
      endTime: '01:00',
      endTimeObject: Temporal.PlainTime.from('01:00'),
    },
    ...menus.value,
  ]
}

const removeMenuItem = (menu: TConfigMenu) => {
  const menuItemIndex = menus.value?.findIndex((m) => {
    return (
      m.venue.id === menu.venue.id && m.startTime === menu.startTime && m.endTime === menu.endTime
    )
  })
  menus.value = menus.value?.filter((_, index) => index !== menuItemIndex)
}

const { venueNames } = storeToRefs(useVenueNamesStore())

const message = ref()
const handleSubmit = async () => {
  configuration.update({ menus: menus.value })
  message.value = 'Save successful'
}
</script>

<template>
  <PageTitle>Menu Setup</PageTitle>
  <form
    id="EditForm"
    @submit.prevent="handleSubmit"
    class="grid grid-cols-2 @[600px]/content:grid-cols-4 gap-4 items-stretch"
  >
    <button
      @click="addMenuItem"
      class="flex flex-col gap-2 items-center justify-center w-full aspect-square bg-white rounded-md shadow hover:bg-gray-50 active:bg-gray-50 hover:outline-1 hover:outline-(--secondary-color) focus-visible:outline-1 focus-visible:outline-(--secondary-color)"
      type="button"
    >
      <PlusCircleIcon class="size-6" />
      <span>Add</span>
    </button>
    <FormGroup v-for="(menu, index) in menus" :key="useId()" class="relative">
      <button
        type="button"
        @click="removeMenuItem(menu)"
        class="absolute right-2 top-2 rounded-full hover:outline-1 hover:outline-(--secondary-color) focus-visible:outline-1 focus-visible:outline-(--secondary-color)"
      >
        <XCircleIcon class="size-5" />
      </button>
      <FormSelect
        label="Venue"
        v-model="menu.venue"
        :options="venueNames?.map((v) => ({ value: v, label: v.name })) ?? []"
      />
      <FormSelect
        label="Layout"
        v-model="menu.layout"
        :options="layouts?.map((l) => ({ value: l, label: l.name })) ?? []"
      />
      <FormInput
        label="Start Time"
        type="time"
        :min="menus?.[index - 1]?.endTime"
        :max="menu.endTime"
        v-model="menu.startTime"
      />
      <FormInput
        label="End Time"
        type="time"
        :min="menu.startTime"
        :max="menus?.[index + 1]?.startTime"
        v-model="menu.endTime"
      />
    </FormGroup>

    <FormSubmit form="EditForm" />
  </form>
  <Alert v-model="message" />
</template>
