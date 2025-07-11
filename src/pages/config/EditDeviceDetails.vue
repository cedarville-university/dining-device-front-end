<script setup lang="ts">
import Alert from '@/components/Alert.vue'
import AppButton from '@/components/AppButton.vue'
import FormGroup from '@/components/FormGroup.vue'
import FormInput from '@/components/FormInput.vue'
import FormSubmit from '@/components/FormSubmit.vue'
import PageTitle from '@/components/PageTitle.vue'
import { type TDevice, type TDeviceDimension } from '@/db'
import { deepUnref } from '@/functions/deepUnref'
import { useDevicesStore } from '@/stores/devicesStore'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  deviceId: string
}
const { deviceId } = defineProps<Props>()

const device = ref<TDevice>()
let landscapeDimensions = reactive<Partial<TDeviceDimension>>({})
let portraitDimensions = reactive<Partial<TDeviceDimension>>({})

const devices = useDevicesStore()

onMounted(async () => {
  device.value = deepUnref(devices.devices?.find((device) => device.id === +deviceId))
  device.value?.dimensions.forEach((dim) => {
    if (dim.orientation === 'landscape') {
      landscapeDimensions = dim
    }
    if (dim.orientation === 'portrait') {
      portraitDimensions = dim
    }
  })
})

const route = useRoute()
const message = ref()

onMounted(() => {
  nextTick(() => {
    message.value = route.query.message as string
  })
})

const handleSubmit = async () => {
  if (device.value === undefined) return

  devices.update(+deviceId, device.value)
  message.value = `${device.value.name} saved successfully`
}

const fetchDimensions = () => {
  landscapeDimensions.width = portraitDimensions.height = window.innerWidth
  landscapeDimensions.height = portraitDimensions.width = window.innerHeight
}
</script>

<template>
  <PageTitle>{{ device?.name }}</PageTitle>
  <form
    id="EditDeviceDetails"
    v-if="device !== undefined"
    @submit.prevent="handleSubmit"
    class="space-y-4"
  >
    <FormGroup class="space-y-4">
      <FormInput v-model="device.name" label="Name" type="textarea" class="w-md" />
      <FormInput v-model="device.model" label="Model" />
    </FormGroup>

    <FormGroup title="Landscape" class="space-y-4">
      <FormInput
        v-model="landscapeDimensions.width"
        type="number"
        label="Width"
        min="1"
        post-fix="px"
      />
      <FormInput
        v-model="landscapeDimensions.height"
        type="number"
        label="Height"
        min="1"
        post-fix="px"
      />

      <template #actions>
        <AppButton type="button" @click="fetchDimensions" variant="ghost" class="text-sm"
          >Request from window</AppButton
        >
      </template>
    </FormGroup>

    <FormGroup title="Portrait" class="space-y-4">
      <FormInput
        v-model="portraitDimensions.width"
        type="number"
        label="Width"
        min="1"
        post-fix="px"
      />
      <FormInput
        v-model="portraitDimensions.height"
        type="number"
        label="Height"
        min="1"
        post-fix="px"
      />

      <template #actions>
        <AppButton type="button" @click="fetchDimensions" variant="ghost" class="text-sm"
          >Request from window</AppButton
        >
      </template>
    </FormGroup>

    <FormSubmit form="EditDeviceDetails" />
  </form>

  <Alert v-model="message" />
</template>
