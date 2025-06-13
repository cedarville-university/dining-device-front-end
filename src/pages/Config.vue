<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import PageHeader from '@/components/PageHeader.vue'
import useConfiguration from '@/composables/useConfiguration'

const { configuration } = useConfiguration()
</script>

<template>
  <PageHeader title="Device Configuration">
    <AppButton to="/"> Back Home </AppButton>
  </PageHeader>
  <div>
    {{ configuration }}
  </div>
</template>
