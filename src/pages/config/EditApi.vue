<script setup lang="ts">
import { ref } from 'vue'
import PageTitle from '@/components/PageTitle.vue'
import FormInput from '@/components/FormInput.vue'
import { useConfigurationStore } from '@/stores/configurationStore'
import FormGroup from '@/components/FormGroup.vue'
import FormSubmit from '@/components/FormSubmit.vue'
import Alert from '@/components/Alert.vue'

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
    <FormGroup>
      <FormInput label="URL" type="textarea" v-model="apiUrl" required class="w-md" />
      <FormInput label="Campus" v-model="apiCampus" required />
    </FormGroup>

    <FormSubmit form="EditForm" />
  </form>

  <Alert v-model="message" />
</template>
