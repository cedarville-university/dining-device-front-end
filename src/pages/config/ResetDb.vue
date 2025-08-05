<script setup lang="ts">
import AlertBox from '@/components/AlertBox.vue'
import FormSubmitButton from '@/components/FormSubmitButton.vue'
import Dexie from 'dexie'

function resetDb() {
  if (
    confirm(
      'Are you sure you want to reset the local data on this device back to default? This action cannot be undone.',
    )
  ) {
    Dexie.delete('dining-menu')
      .then(() => {
        window.location.reload()
      })
      .catch(() => {
        alert('Could not reset local data')
      })
  }
}
</script>

<template>
  <div class="bg-white rounded-md shadow">
    <h3 class="px-4 pt-4 font-semibold text-lg row-start-1 col-span-full mb-4">Reset to Default</h3>

    <div class="p-4 space-y-8">
      <AlertBox variant="warning" title="Caution">
        Clicking 'Reset to Default' will reset all customizations and menu setup for this device
        back to default. Proceed with caution.
      </AlertBox>

      <FormSubmitButton type="button" @click="resetDb" class="text-sm"
        >Reset to Default</FormSubmitButton
      >
    </div>
  </div>
</template>
