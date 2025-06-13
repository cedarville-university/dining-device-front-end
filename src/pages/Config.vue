<script setup lang="ts">
import useConfiguration from '@/composables/useConfiguration'

const { configuration } = useConfiguration()
</script>

<template>
  <RouterLink to="/">Back Home</RouterLink>
  {{ configuration }}
</template>
