<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TDevice, TDeviceDimension } from '@/db'
import PageTitle from '@/components/PageTitle.vue'
import FormSelect from '@/components/FormSelect.vue'
import FormInput from '@/components/FormInput.vue'
import AppButton from '@/components/AppButton.vue'
import Alert from '@/components/Alert.vue'
import { useConfigurationStore } from '@/stores/configurationStore'
import { useDevicesStore } from '@/stores/devicesStore'
import { storeToRefs } from 'pinia'

const configuration = useConfigurationStore()
const { devices } = storeToRefs(useDevicesStore())

const device = ref(configuration.device)
const orientation = ref(configuration.orientation)
const layout = ref(configuration.layout?.component)

const toSeconds = (ms: number = 0) => ms / 1000
const toMinutes = (ms: number = 0) => ms / (60 * 1000)
const toHours = (ms: number = 0) => ms / (60 * 60 * 1000)
const toMilliseconds = (value: number = 0, from = 'seconds') => {
  switch (from) {
    case 'hours':
      return value * 60 * 60 * 1000
    case 'minutes':
      return value * 60 * 1000
    case 'seconds':
    default:
      return value * 1000
  }
}

const layoutRefreshRate = ref(toSeconds(configuration.refreshRates?.layout))
const menuRefreshRate = ref(toHours(configuration.refreshRates?.menu))
const pioneerRefreshRate = ref(toHours(configuration.refreshRates?.pioneer))

const colorsPrimary = ref(configuration.primaryColor)
const colorsSecondary = ref(configuration.secondaryColor)
const colorsGray = ref(configuration.grayColor)

const headerHeight = ref(configuration.headerHeight)
const headerBgColor = ref(configuration.headerBg)
const headerColor = ref(configuration.headerColor)

const canvasBgColor = ref(configuration.canvasBg)
const canvasColor = ref(configuration.canvasColor)

const showBezel = ref(configuration.showBezel)
const bezelWidth = ref(configuration.bezelWidth)
const bezelBgColor = ref(configuration.bezelBg)

const dimensions = computed(() =>
  device.value?.dimensions.find((dim: TDeviceDimension) => dim.orientation === orientation.value),
)

const layoutDescription = computed(() => {
  switch (layout.value) {
    case 'GridLayout':
      return 'The grid layout renders the menu as a grid of cards. The number of columns and rows will be determined dynamically based on the number of menut items.'
    default:
      return undefined
  }
})

const message = ref()
const handleSubmit = async (e: SubmitEvent) => {
  if (!layout.value) return

  configuration.update({
    orientation: orientation.value,
    showBezel: showBezel.value,
    refreshRates: {
      layout: toMilliseconds(+layoutRefreshRate.value, 'seconds'),
      menu: toMilliseconds(+menuRefreshRate.value, 'hours'),
      pioneer: toMilliseconds(+pioneerRefreshRate.value, 'hours'),
    },
    layout: {
      component: layout.value,
      colors: {
        primary: colorsPrimary.value,
        secondary: colorsSecondary.value,
        gray: colorsGray.value,
      },
      canvas: {
        bgColor: canvasBgColor.value,
        color: canvasColor.value,
      },
      header: {
        height: headerHeight.value,
        bgColor: headerBgColor.value,
        color: headerColor.value,
      },
      bezel: {
        width: bezelWidth.value,
        bgColor: bezelBgColor.value,
      },
    },
    device: device.value,
  })

  message.value = 'Save successful'
}
</script>

<template>
  <PageTitle>Device Setup</PageTitle>

  <form id="EditForm" @submit.prevent="(e) => handleSubmit(e as SubmitEvent)" class="grid gap-4">
    <div class="grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <h3 class="font-semibold row-start-1 col-span-full">Device</h3>
      <FormSelect
        v-if="devices"
        class="row-start-2 col-span-3 @[600px]/content:col-span-2"
        label="Model"
        :options="
          devices?.map((device: TDevice) => ({
            label: device.model,
            value: device,
          }))
        "
        v-model="device"
      />
      <div class="row-start-2 col-span-5 @[600px]/content:col-span-6 border-l-5 pl-4">
        <h3 class="font-semibold">{{ device?.name }}</h3>
        <div class="text-sm text-gray-500">
          {{ device?.model }}<br />
          {{ dimensions?.width }}x{{ dimensions?.height }}
        </div>
      </div>
      <FormSelect
        v-if="device?.dimensions"
        class="row-start-3 col-span-3 @[600px]/content:col-span-2"
        label="Orientation"
        :options="
          device.dimensions.map((dim: TDeviceDimension) => ({
            value: dim.orientation,
            label: dim.orientation.substring(0, 1).toUpperCase() + dim.orientation.substring(1),
          }))
        "
        v-model="orientation"
      />
      <FormSelect
        class="row-start-4 col-span-3 @[600px]/content:col-span-2"
        label="Layout"
        :options="[{ value: 'GridLayout', label: 'Grid Layout' }]"
        v-model="layout"
      />
      <div
        v-if="layoutDescription"
        class="row-start-4 col-span-5 @[600px]/content:col-span-6 border-l-5 pl-4 text-sm text-gray-500"
      >
        {{ layoutDescription }}
      </div>
    </div>

    <div class="w-full grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <h3 class="font-semibold col-span-full">Refresh Rates</h3>
      <FormInput
        type="number"
        step="1"
        min="5"
        max="60"
        class="col-span-3 @[600px]/content:col-span-2"
        label="Layout"
        v-model="layoutRefreshRate"
        post-fix="S"
      />
      <div class="col-span-5 @[600px]/content:col-span-6 border-l-5 pl-4">
        <h3 class="font-semibold">Every {{ layoutRefreshRate }} seconds</h3>
        <div class="text-sm text-gray-500">
          How often should the device check for venue changes?
        </div>
      </div>
      <FormInput
        type="number"
        step="1"
        min="1"
        max="12"
        class="col-span-3 @[600px]/content:col-span-2"
        label="Menu Data"
        v-model="menuRefreshRate"
        post-fix="HR"
      />
      <div class="col-span-5 @[600px]/content:col-span-6 border-l-5 pl-4">
        <h3 class="font-semibold">Every {{ menuRefreshRate }} hours</h3>
        <div class="text-sm text-gray-500">
          How often should the device check for menu changes? This will pick up any new changes to
          the menu data stored in the database.
        </div>
      </div>
      <FormInput
        type="number"
        step="1"
        min="2"
        max="12"
        class="col-span-3 @[600px]/content:col-span-2"
        label="Pioneer Data"
        v-model="pioneerRefreshRate"
        post-fix="HR"
      />
      <div class="col-span-5 @[600px]/content:col-span-6 border-l-5 pl-4">
        <h3 class="font-semibold">Every {{ pioneerRefreshRate }} hours</h3>
        <div class="text-sm text-gray-500">
          How often should the device fetch data from pioneer? This will fetch and store menu data
          in the database.
        </div>
      </div>
    </div>

    <div class="grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <h3 class="font-semibold col-span-full">Colors</h3>

      <FormInput
        class="row-start-2 col-span-full"
        label="Primary Color"
        type="color"
        v-model="colorsPrimary"
      />
      <FormInput
        class="row-start-3 col-span-full"
        label="Secondary Color"
        type="color"
        v-model="colorsSecondary"
      />
      <FormInput
        class="row-start-4 col-span-full"
        label="Gray Color"
        type="color"
        v-model="colorsGray"
      />
    </div>

    <div class="grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <h3 class="font-semibold col-span-full">Header</h3>
      <FormInput
        type="number"
        step="1"
        min="0"
        label="Height"
        v-model="headerHeight"
        class="row-start-2 col-span-3 @[600px]/content:col-span-2 w-12"
        post-fix="px"
      />

      <FormInput
        class="row-start-3 col-span-full"
        label="Background Color"
        type="color"
        v-model="headerBgColor"
      />
      <FormInput
        class="row-start-4 col-span-full"
        label="Text Color"
        type="color"
        v-model="headerColor"
      />
    </div>

    <div class="grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <h3 class="font-semibold">Canvas</h3>
      <FormInput
        class="row-start-2 col-span-full"
        label="Background Color"
        type="color"
        v-model="canvasBgColor"
      />
      <FormInput
        class="row-start-3 col-span-full"
        label="Text Color"
        type="color"
        v-model="canvasColor"
      />
    </div>

    <div class="w-full grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <h3 class="font-semibold col-span-full">Bezel</h3>
      <p class="col-span-full text-sm text-gray-400">
        The bezel is only used when testing the device on a computer.
      </p>
      <FormSelect
        label="Show Bezel"
        :options="[
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ]"
        v-model="showBezel"
        class="row-start-3 col-span-2"
      />
      <FormInput
        type="number"
        step="1"
        min="0"
        label="Width"
        v-model="bezelWidth"
        class="row-start-4 col-span-3 @[600px]/content:col-span-2 w-12"
        post-fix="px"
      />

      <FormInput class="row-start-5" label="Color" type="color" v-model="bezelBgColor" />
    </div>
  </form>

  <Alert v-model="message" />
  <Teleport to="#PageHeaderAction" defer>
    <AppButton form="EditForm" type="submit"> Save </AppButton>
  </Teleport>
</template>
