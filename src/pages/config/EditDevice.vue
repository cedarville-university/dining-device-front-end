<script setup lang="ts">
import { computed, inject, onMounted, ref, toValue, unref } from 'vue'
import * as Config from '@/models/configuration'
import * as Device from '@/models/devices'
import type { TConfiguration, TDevice, TDeviceDimension } from '@/db'
import PageTitle from '@/components/PageTitle.vue'
import FormSelect from '@/components/FormSelect.vue'
import FormInput from '@/components/FormInput.vue'
import AppButton from '@/components/AppButton.vue'
import { injectionKey } from '@/App.vue'
import Alert from '@/components/Alert.vue'

const render = inject(injectionKey)

const configuration = ref<TConfiguration>()
const device = ref()
const devices = ref()
onMounted(async () => {
  devices.value = await Device.all()
})

const orientation = ref()

const layout = ref()

const showBezel = ref()
const bezelWidth = ref()
const bezelBgColor = ref()

const canvasBgColor = ref()

const headerHeight = ref()
const headerBgColor = ref()
const headerColor = ref()
onMounted(async () => {
  configuration.value = await Config.get()
  if (configuration.value) {
    device.value = configuration.value.device

    orientation.value = configuration.value.orientation

    layout.value = configuration.value.layout.component

    showBezel.value = configuration.value.showBezel
    bezelWidth.value = configuration.value.layout.bezel.width
    bezelBgColor.value = configuration.value.layout.bezel.bgColor

    canvasBgColor.value = configuration.value.layout.canvas.bgColor

    headerHeight.value = configuration.value.layout.header.height
    headerBgColor.value = configuration.value.layout.header.bgColor
    headerColor.value = configuration.value.layout.header.color
  }
})

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
  if (
    !configuration.value ||
    !device.value ||
    !dimensions.value?.width ||
    !dimensions.value?.height ||
    !dimensions.value.orientation
  )
    return

  const result = await Config.update({
    ...configuration.value,
    orientation: orientation.value,
    showBezel: showBezel.value,
    layout: {
      component: layout.value,
      canvas: {
        bgColor: canvasBgColor.value,
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

  if (result) {
    message.value = 'Save successful. Reload the window to see the changes applied.'
    if ((e.submitter as HTMLButtonElement)?.name === 'rerender') render?.rerender()
  }
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
        <h3 class="font-semibold">{{ configuration?.device.name }}</h3>
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
    </div>

    <div class="grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
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
        class="row-start-3"
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
