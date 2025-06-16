<script setup lang="ts">
import { type TConfiguration, type TConfigMenu, type TVenueName } from '@/db'
import { PlusCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import { onMounted, ref, watch } from 'vue'
import * as Venue from '@/models/venues'
import * as Config from '@/models/configuration'
import AppButton from '@/components/AppButton.vue'
import Alert from '@/components/Alert.vue'
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'
import PageTitle from '@/components/PageTitle.vue'

const configuration = ref<TConfiguration>()
const menus = ref<TConfigMenu[]>([])
onMounted(async () => {
  configuration.value = await Config.get()
  if (configuration.value) {
    menus.value = configuration.value.menus.sort((menuA, menuB) => {
      if (menuA.startTime > menuB.startTime) return 1
      if (menuA.startTime < menuB.startTime) return -1
      return 0
    })
  }
})

const addMenu = () => {
  menus.value = [
    {
      name: venueNames.value?.[0].name,
      startTime: '00:00',
      endTime: '00:00',
    },
    ...menus.value,
  ]
}

const removeMenu = (menu: TConfigMenu) => {
  const menuIndex = menus.value?.findIndex((m) => {
    return m.name === menu.name && m.startTime === menu.startTime && m.endTime === menu.endTime
  })
  menus.value = menus.value?.filter((_, index) => index !== menuIndex)
}

const venueNames = ref<TVenueName[]>([])
onMounted(async () => {
  venueNames.value = await Venue.all()
})

const message = ref()
const handleSubmit = async () => {
  if (!menus.value || !configuration.value) return

  const config = await Config.get()
  if (!config) return

  const result = await Config.updateMenus(config, menus.value)

  if (result) {
    message.value = 'Save successful'
  }
}
</script>

<template>
  <PageTitle>Menu Setup</PageTitle>
  <form id="EditForm" @submit.prevent="handleSubmit" class="grid grid-cols-4 gap-4 items-stretch">
    <button
      @click="addMenu"
      class="flex flex-col gap-2 items-center justify-center w-full aspect-square bg-white rounded-md shadow hover:bg-gray-50 active:bg-gray-50"
      type="button"
    >
      <PlusCircleIcon class="size-6" />
      <span>Add</span>
    </button>
    <div
      v-for="(menu, index) in menus"
      :key="menu.name + menu.startTime + menu.endTime"
      class="relative flex flex-col gap-2 bg-white p-4 shadow rounded-md"
    >
      <button type="button" @click="removeMenu(menu)" class="absolute right-2 top-2">
        <XCircleIcon class="size-5" />
      </button>
      <FormSelect label="Name" v-model="menu.name" :options="venueNames.map((v) => v.name)" />
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
