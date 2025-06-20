<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { get as getConfig, update as updateConfig } from '@/models/configuration'
import type { TConfiguration } from '@/db'
import PageTitle from '@/components/PageTitle.vue'
import FormInput from '@/components/FormInput.vue'
import AppButton from '@/components/AppButton.vue'
import Alert from '@/components/Alert.vue'

const configuration = ref<TConfiguration>()
const apiUrl = ref<string>()
const apiCampus = ref<string>()

onMounted(async () => {
  configuration.value = await getConfig()
  if (configuration.value) {
    apiUrl.value = configuration.value.api.url
    apiCampus.value = configuration.value.api.campus
  }
})

const message = ref()
const handleSubmit = async () => {
  if (!configuration.value || !apiUrl.value || !apiCampus.value) return

  const result = await updateConfig({
    ...configuration.value,
    api: {
      url: apiUrl.value,
      campus: apiCampus.value,
    },
  })

  if (result) {
    message.value = 'Save successful'
  }
}
</script>

<template>
  <PageTitle>API Setup</PageTitle>

  <form id="EditForm" @submit.prevent="handleSubmit" class="grid gap-4">
    <div class="grid grid-cols-8 gap-4 bg-white rounded-md p-4 shadow">
      <FormInput
        label="URL"
        type="textarea"
        v-model="apiUrl"
        class="row-start-1 col-span-full"
        required
      />

      <FormInput label="Campus" v-model="apiCampus" class="row-start-2 col-span-full" required />
    </div>
  </form>

  <Alert v-model="message" />
  <Teleport to="#PageHeaderAction" defer>
    <AppButton form="EditForm" type="submit"> Save </AppButton>
  </Teleport>
</template>
