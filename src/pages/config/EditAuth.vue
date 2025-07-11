<script setup lang="ts">
import { reactive, ref } from 'vue'
import PageTitle from '@/components/PageTitle.vue'
import FormInput from '@/components/FormInput.vue'
import { useConfigurationStore } from '@/stores/configurationStore'
import FormGroup from '@/components/FormGroup.vue'
import FormSubmit from '@/components/FormSubmit.vue'
import Alert from '@/components/Alert.vue'

const configuration = useConfigurationStore()
const kioskAuth = ref(configuration.auth?.kiosk)
const configAuth = ref(configuration.auth?.configuration)
const state = reactive({
  kiosk: {
    error: '',
  },
  config: {
    error: '',
  },
})

const message = ref()
const handleSubmit = async () => {
  state.kiosk.error = ''
  state.config.error = ''

  if (kioskAuth.value === undefined || kioskAuth.value.toString().trim().length === 0) {
    state.kiosk.error = 'the Kiosk PIN is required'
    return
  }

  const kiosk = kioskAuth.value.toString().trim().padStart(4, '1')

  if (kiosk.length > 4) {
    state.kiosk.error = 'the Kiosk PIN must be 4 characters long'
    return
  }

  if (kiosk.match(/[^1-4]/g)) {
    state.kiosk.error = 'the Kiosk PIN can only be digits 1-4'
    return
  }

  if (configAuth.value === undefined || configAuth.value.toString().trim().length === 0) {
    state.config.error = 'the Configuration PIN is required'
    return
  }

  const config = configAuth.value.toString().trim().padStart(6, '0')
  if (config.length > 6) {
    state.config.error = 'the Configuration PIN must be 6 characters long'
    return
  }

  if (config.match(/[^\d]/g)) {
    state.kiosk.error = 'the Configuration PIN can only be digits'
    return
  }

  configuration.update({
    auth: {
      kiosk,
      configuration: config,
    },
  })
  message.value = 'Save successful'
}
</script>

<template>
  <PageTitle>Auth Setup</PageTitle>

  <form id="EditForm" @submit.prevent="handleSubmit" class="space-y-4">
    <FormGroup>
      <div class="flex gap-4">
        <FormInput
          label="Kiosk"
          type="number"
          min="1"
          max="4444"
          v-model="kioskAuth"
          class="flex-1"
        />
        <div class="flex-1 @[600px]/content:flex-3 border-l-5 pl-4">
          <h3 class="font-semibold">Kiosk Mode PIN</h3>
          <div class="text-sm text-gray-500">
            The Kiosk PIN is a 4-digit pin used when exiting kiosk mode. The only allowed digits are
            1-4.
          </div>
          <div v-if="state.kiosk.error" class="text-sm text-red-500">{{ state.kiosk.error }}</div>
        </div>
      </div>

      <div class="flex gap-4">
        <FormInput
          label="Configuration"
          type="number"
          min="0"
          max="999999"
          v-model="configAuth"
          class="flex-1"
        />
        <div class="flex-1 @[600px]/content:flex-3 border-l-5 pl-4">
          <h3 class="font-semibold">Configuration PIN</h3>
          <div class="text-sm text-gray-500">
            The Configuration PIN is a 6-digit pin used when entering device configuration.
          </div>
          <div v-if="state.config.error" class="text-sm text-red-500">{{ state.config.error }}</div>
        </div>
      </div>
    </FormGroup>

    <FormSubmit form="EditForm" />
  </form>

  <Alert v-model="message" />
</template>
