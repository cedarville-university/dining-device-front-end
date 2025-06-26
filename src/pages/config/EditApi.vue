<script setup lang="ts">
import { ref } from 'vue'
import PageTitle from '@/components/PageTitle.vue'
import FormInput from '@/components/FormInput.vue'
import AppButton from '@/components/AppButton.vue'
import Alert from '@/components/Alert.vue'
import { useConfigurationStore } from '@/stores/configurationStore'

const configuration = useConfigurationStore()
const apiUrl = ref(configuration.api?.url)
const apiCampus = ref(configuration.api?.campus)

const message = ref()
const handleSubmit = async () => {
  if (!apiUrl.value || !apiCampus.value) return

  configuration.update({
    api: {
      url: apiUrl.value,
      campus: apiCampus.value,
    },
  })
  message.value = 'Save successful'
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
        class="row-start-1 col-span-full w-50"
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
