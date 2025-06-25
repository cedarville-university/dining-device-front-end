<script setup lang="ts">
import { type TConfigMenu } from '@/db'
import { PlusCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import Alert from '@/components/Alert.vue'
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'
import PageTitle from '@/components/PageTitle.vue'
import { useConfigurationStore } from '@/stores/configurationStore'
import { storeToRefs } from 'pinia'
import { useVenueNamesStore } from '@/stores/venueNamesStore'

const configuration = useConfigurationStore()
const menus = ref(configuration.menus)

const addMenuItem = () => {
  if (!menus.value) menus.value = []

  menus.value = [
    {
      venueName: {
        id: venueNames.value?.[0].id,
        name: venueNames.value?.[0].name,
        apiName: venueNames.value?.[0].apiName,
      },
      venueId: venueNames.value?.[0].id ?? -1,
      startTime: '00:00',
      endTime: '00:00',
    },
    ...menus.value,
  ]
}

const removeMenuItem = (menu: TConfigMenu) => {
  const menuItemIndex = menus.value?.findIndex((m) => {
    return (
      m.venueId === menu.venueId && m.startTime === menu.startTime && m.endTime === menu.endTime
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
      class="flex flex-col gap-2 items-center justify-center w-full aspect-square bg-white rounded-md shadow hover:bg-gray-50 active:bg-gray-50"
      type="button"
    >
      <PlusCircleIcon class="size-6" />
      <span>Add</span>
    </button>
    <div
      v-for="(menu, index) in menus"
      :key="menu.venueId + menu.startTime + menu.endTime"
      class="relative flex flex-col gap-2 bg-white p-4 shadow rounded-md"
    >
      <button type="button" @click="removeMenuItem(menu)" class="absolute right-2 top-2">
        <XCircleIcon class="size-5" />
      </button>
      <FormSelect
        label="Name"
        v-model="menu.venueId"
        :options="venueNames?.map((v) => ({ value: v.id, label: v.name })) ?? []"
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
    </div>
  </form>
  <Alert v-model="message" />
  <Teleport to="#PageHeaderAction">
    <AppButton form="EditForm" type="submit"> Save </AppButton>
  </Teleport>
</template>
