<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import FormGroup from '@/components/FormGroup.vue'
import FormInput from '@/components/FormInput.vue'
import FormSubmit from '@/components/FormSubmit.vue'
import PageTitle from '@/components/PageTitle.vue'
import { useDevicesStore } from '@/stores/devicesStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const model = ref('')
const landscapeWidth = ref<number>()
const landscapeHeight = ref<number>()
const portraitWidth = ref<number>()
const portraitHeight = ref<number>()

const devices = useDevicesStore()
const router = useRouter()

const handleSubmit = async () => {
  const deviceId = await devices.create({
    name: name.value,
    model: model.value,
    dimensions: [
      {
        orientation: 'landscape',
        width: landscapeWidth.value ?? window.innerWidth,
        height: landscapeHeight.value ?? window.innerHeight,
      },
      {
        orientation: 'portrait',
        width: portraitWidth.value ?? window.innerHeight,
        height: portraitHeight.value ?? window.innerWidth,
      },
    ],
  })

  router.replace({
    name: 'edit-device-details',
    params: { deviceId },
    query: { message: `${name.value} saved successfully` },
  })
}

const fetchDimensions = () => {
  landscapeWidth.value = portraitHeight.value = window.innerWidth
  landscapeHeight.value = portraitWidth.value = window.innerHeight
}
</script>

<template>
  <PageTitle>Add New Device</PageTitle>
  <form id="AddDeviceDetails" @submit.prevent="handleSubmit" class="space-y-4">
    <FormGroup class="space-y-4">
      <FormInput v-model="name" label="Name" type="textarea" class="w-md" />
      <FormInput v-model="model" label="Model" />
    </FormGroup>

    <FormGroup title="Landscape" class="space-y-4">
      <FormInput v-model="landscapeWidth" type="number" label="Width" min="1" post-fix="px" />
      <FormInput v-model="landscapeHeight" type="number" label="Height" min="1" post-fix="px" />

      <template #actions>
        <AppButton type="button" @click="fetchDimensions" variant="ghost" class="text-sm"
          >Request from window</AppButton
        >
      </template>
    </FormGroup>

    <FormGroup title="Portrait" class="space-y-4">
      <FormInput v-model="portraitWidth" type="number" label="Width" min="1" post-fix="px" />
      <FormInput v-model="portraitHeight" type="number" label="Height" min="1" post-fix="px" />

      <template #actions>
        <AppButton type="button" @click="fetchDimensions" variant="ghost" class="text-sm"
          >Request from window</AppButton
        >
      </template>
    </FormGroup>

    <FormSubmit form="AddDeviceDetails">Add Device</FormSubmit>
  </form>
</template>
