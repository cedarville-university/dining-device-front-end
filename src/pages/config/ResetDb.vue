<script setup lang="ts">
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

    <div class="p-4 space-y-4">
      <div class="flex gap-4 items-center bg-orange-500 text-white p-4 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>

        <div>
          <h4 class="font-semibold">Caution</h4>
          <p>
            By clicking 'Reset to Default', all customizations and menu setup for this device will
            be reset to default. Proceed with caution.
          </p>
        </div>
      </div>
      <FormSubmitButton type="button" @click="resetDb" class="text-sm"
        >Reset to Default</FormSubmitButton
      >
    </div>
  </div>
</template>
