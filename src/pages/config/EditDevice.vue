<script setup lang="ts">
import { computed, onMounted, ref, toValue, unref } from 'vue'
import * as Config from '@/models/configuration'
import type { TConfiguration } from '@/db'
import PageTitle from '@/components/PageTitle.vue'
import FormSelect from '@/components/FormSelect.vue'
import FormInput from '@/components/FormInput.vue'
import Alert from '@/components/Alert.vue'
import AppButton from '@/components/AppButton.vue'

const configuration = ref<TConfiguration>()
const deviceModel = ref()

const orientation = ref()

const layout = ref()

const bezelWidth = ref()
const bezelBgColor = ref()

const canvasBgColor = ref()

const headerHeight = ref()
const headerBgColor = ref()
const headerColor = ref()
onMounted(async () => {
  configuration.value = await Config.get()
  if (configuration.value) {
    deviceModel.value = configuration.value.device.model

    orientation.value = configuration.value.orientation

    layout.value = configuration.value.layout.component

    bezelWidth.value = configuration.value.layout.bezel.width
    bezelBgColor.value = configuration.value.layout.bezel.bgColor

    canvasBgColor.value = configuration.value.layout.canvas.bgColor

    headerHeight.value = configuration.value.layout.header.height
    headerBgColor.value = configuration.value.layout.header.bgColor
    headerColor.value = configuration.value.layout.header.color
  }
})

const device = computed(() => configuration.value?.device)
const dimensions = computed(() =>
  device.value?.dimensions.find((dim) => dim.orientation === orientation.value),
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
const handleSubmit = async () => {
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
    device: {
      name: device.value.name,
      model: deviceModel.value,
      dimensions: device.value.dimensions,
    },
  })

  if (result) {
    message.value = 'Save successful'
  }
}
</script>

<template>
  <PageTitle>Device Setup</PageTitle>

  <form id="EditForm" @submit.prevent="handleSubmit" class="grid gap-4">
    <div class="grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <h3 class="font-semibold row-start-1 col-span-full">Device</h3>
      <FormSelect
        class="row-start-2 col-span-2"
        label="Model"
        :options="['MCT-10HPQ']"
        v-model="deviceModel"
      />
      <div class="row-start-2 col-span-6 border-l-5 pl-4">
        <h3 class="font-semibold">{{ configuration?.device.name }}</h3>
        <div class="text-sm text-gray-500">
          {{ device?.model }}<br />
          {{ dimensions?.width }}x{{ dimensions?.height }}
        </div>
      </div>
      <FormSelect
        class="row-start-3 col-span-2"
        label="Orientation"
        :options="[
          { value: 'landscape', label: 'Landscape' },
          { value: 'portrait', label: 'Portrait' },
        ]"
        v-model="orientation"
      />
      <FormSelect
        class="row-start-4 col-span-2"
        label="Layout"
        :options="[{ value: 'GridLayout', label: 'Grid Layout' }]"
        v-model="layout"
      />
      <div
        v-if="layoutDescription"
        class="row-start-4 col-span-6 border-l-5 pl-4 text-sm text-gray-500"
      >
        {{ layoutDescription }}
      </div>
    </div>

    <div class="grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <h3 class="font-semibold col-span-full">Bezel</h3>
      <p class="col-span-full text-sm text-gray-400">
        The bezel is only used when testing the device on a computer.
      </p>
      <FormInput
        type="number"
        step="1"
        min="0"
        label="Width"
        v-model="bezelWidth"
        class="row-start-3 col-span-2 w-12"
        post-fix="px"
      />

      <FormInput class="row-start-4" label="Color" type="color" v-model="bezelBgColor" />
    </div>

    <div class="grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <h3 class="font-semibold col-span-full">Header</h3>
      <FormInput
        type="number"
        step="1"
        min="0"
        label="Height"
        v-model="headerHeight"
        class="row-start-2 col-span-2 w-12"
        post-fix="px"
      />

      <FormInput
        class="row-start-3"
        label="Background Color"
        type="color"
        v-model="headerBgColor"
      />
      <FormInput class="row-start-4" label="Text Color" type="color" v-model="headerColor" />
    </div>

    <div class="grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <h3 class="font-semibold">Canvas</h3>
      <FormInput
        class="row-start-3"
        label="Background Color"
        type="color"
        v-model="canvasBgColor"
      />
    </div>
  </form>

  <Alert v-model="message" />
  <Teleport to="#PageHeaderAction">
    <AppButton form="EditForm" type="submit"> Save </AppButton>
  </Teleport>
</template>
