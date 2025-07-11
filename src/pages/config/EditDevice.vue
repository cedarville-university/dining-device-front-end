<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TDevice, TDeviceDimension } from '@/db'
import PageTitle from '@/components/PageTitle.vue'
import FormSelect from '@/components/FormSelect.vue'
import FormInput from '@/components/FormInput.vue'
import AppButton from '@/components/AppButton.vue'
import { useConfigurationStore } from '@/stores/configurationStore'
import { useDevicesStore } from '@/stores/devicesStore'
import { storeToRefs } from 'pinia'
import NavLink from '@/components/NavLink.vue'
import FormGroup from '@/components/FormGroup.vue'
import FormSubmit from '@/components/FormSubmit.vue'
import Alert from '@/components/Alert.vue'

const configuration = useConfigurationStore()
const devicesStore = useDevicesStore()
const { devices } = storeToRefs(devicesStore)

const device = ref(configuration.device)
const orientation = ref(configuration.orientation)

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
const colorsPrimaryText = ref(configuration.primaryTextColor)
const colorsSecondary = ref(configuration.secondaryColor)
const colorsSecondaryText = ref(configuration.secondaryTextColor)
const colorsGray = ref(configuration.grayColor)
const colorsGrayText = ref(configuration.grayTextColor)

const headerHeight = ref(configuration.headerHeight)
const headerBgColor = ref(configuration.headerBg)
const headerColor = ref(configuration.headerColor)

const canvasBgColor = ref(configuration.canvasBg)
const canvasColor = ref(configuration.canvasColor)

const showBezel = ref(configuration.showBezel)
const bezelWidth = ref(configuration.layout?.bezel.width)
const bezelBgColor = ref(configuration.bezelBg)

const dimensions = computed(() =>
  device.value?.dimensions.find((dim: TDeviceDimension) => dim.orientation === orientation.value),
)

const message = ref()
const handleSubmit = async (e: SubmitEvent) => {
  configuration.update({
    orientation: orientation.value,
    showBezel: showBezel.value,
    refreshRates: {
      layout: toMilliseconds(+layoutRefreshRate.value, 'seconds'),
      menu: toMilliseconds(+menuRefreshRate.value, 'hours'),
      pioneer: toMilliseconds(+pioneerRefreshRate.value, 'hours'),
    },
    layout: {
      colors: {
        primary: colorsPrimary.value,
        primaryText: colorsPrimaryText.value,
        secondary: colorsSecondary.value,
        secondaryText: colorsSecondaryText.value,
        gray: colorsGray.value,
        grayText: colorsGrayText.value,
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

const handleDelete = () => {
  if (device.value === undefined) return
  if (device.value.id === configuration?.device?.id) return

  devicesStore.del(device.value.id)
  device.value = configuration.device
  message.value = 'Device deleted successfully'
}
</script>

<template>
  <PageTitle>Device Setup</PageTitle>

  <form id="EditForm" @submit.prevent="(e) => handleSubmit(e as SubmitEvent)" class="space-y-4">
    <FormGroup title="Device">
      <div class="flex gap-4">
        <FormSelect
          v-if="devices"
          class="flex-1"
          label="Model"
          :options="
            devices?.map((device: TDevice) => ({
              label: device.model,
              value: device,
            }))
          "
          v-model="device"
        />
        <div class="flex-1 @[600px]/content:flex-3 border-l-5 pl-4">
          <h3 class="font-semibold">{{ device?.name }}</h3>
          <div class="text-sm text-gray-500">
            {{ device?.model }}<br />
            {{ dimensions?.width }}x{{ dimensions?.height }}
          </div>
        </div>
      </div>
      <FormSelect
        v-if="device?.dimensions"
        class="w-max"
        label="Orientation"
        :options="
          device.dimensions.map((dim: TDeviceDimension) => ({
            value: dim.orientation,
            label: dim.orientation.substring(0, 1).toUpperCase() + dim.orientation.substring(1),
          }))
        "
        v-model="orientation"
      />

      <template #actions>
        <div class="flex gap-2 w-full">
          <NavLink
            :to="{ name: 'edit-device-details', params: { deviceId: device?.id } }"
            class="w-max text-sm bg-(--primary-color)! text-white"
            >Edit Device Details</NavLink
          >
          <AppButton :to="{ name: 'add-device' }" variant="ghost" class="text-sm"
            >Add new device</AppButton
          >
          <AppButton
            v-if="device?.id !== configuration?.device?.id"
            type="button"
            @click="handleDelete"
            class="bg-red-500 hover:bg-red-600 active:bg-red-600 text-white hover:text-white ml-auto text-sm border-0"
            >Delete Device</AppButton
          >
        </div>
      </template>
    </FormGroup>

    <FormGroup title="Refresh Rates">
      <div class="flex gap-2">
        <FormInput
          type="number"
          step="1"
          min="5"
          max="60"
          class="flex-1"
          label="Layout"
          v-model="layoutRefreshRate"
          post-fix="S"
        />
        <div class="flex-1 @[600px]/content:flex-3 border-l-5 pl-4">
          <h3 class="font-semibold">Every {{ layoutRefreshRate }} seconds</h3>
          <div class="text-sm text-gray-500">
            How often should the device check for venue schedule changes?
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <FormInput
          type="number"
          step="1"
          min="1"
          max="12"
          class="flex-1"
          label="Menu Data"
          v-model="menuRefreshRate"
          post-fix="HR"
        />
        <div class="flex-1 @[600px]/content:flex-3 border-l-5 pl-4">
          <h3 class="font-semibold">Every {{ menuRefreshRate }} hours</h3>
          <div class="text-sm text-gray-500">
            How often should the device check for menu changes? This will fetch for menu changes
            from the pioneer API for the current day.
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <FormInput
          type="number"
          step="1"
          min="2"
          max="12"
          label="Pioneer Data"
          v-model="pioneerRefreshRate"
          post-fix="HR"
          class="flex-1"
        />
        <div class="flex-1 @[600px]/content:flex-3 border-l-5 pl-4">
          <h3 class="font-semibold">Every {{ pioneerRefreshRate }} hours</h3>
          <div class="text-sm text-gray-500">
            How often should the device fetch and cache data from pioneer servers? This will fetch
            menus for the next 7 days per the schedule.
          </div>
        </div>
      </div>
    </FormGroup>

    <FormGroup title="Colors">
      <FormInput label="Primary Color" type="color" v-model="colorsPrimary" />
      <FormInput label="Primary Text Color" type="color" v-model="colorsPrimaryText" />
      <FormInput label="Secondary Color" type="color" v-model="colorsSecondary" />
      <FormInput label="Secondary Text Color" type="color" v-model="colorsSecondaryText" />
      <FormInput label="Gray Color" type="color" v-model="colorsGray" />
      <FormInput label="Gray Text Color" type="color" v-model="colorsGrayText" />
    </FormGroup>

    <FormGroup title="Header">
      <FormInput
        type="number"
        step="1"
        min="0"
        label="Height"
        v-model="headerHeight"
        post-fix="px"
      />

      <FormInput label="Background Color" type="color" v-model="headerBgColor" />
      <FormInput label="Text Color" type="color" v-model="headerColor" />
    </FormGroup>

    <FormGroup title="Canvas">
      <FormInput label="Background Color" type="color" v-model="canvasBgColor" />
      <FormInput label="Text Color" type="color" v-model="canvasColor" />
    </FormGroup>

    <FormGroup title="Bezel">
      <p class="-mt-6 col-span-full text-sm text-gray-400">
        The bezel is only used when testing the device on a computer.
      </p>
      <FormSelect
        label="Show Bezel"
        :options="[
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ]"
        v-model="showBezel"
        class="w-max"
      />
      <FormInput type="number" step="1" min="0" label="Width" v-model="bezelWidth" post-fix="px" />
      <FormInput label="Color" type="color" v-model="bezelBgColor" />
    </FormGroup>

    <FormSubmit form="EditForm" />
  </form>

  <Alert v-model="message" />
</template>
