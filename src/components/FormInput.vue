<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  id?: string
  label: string
  error?: string
  postFix?: string
}

const { id = useId() } = defineProps<Props>()

const model = defineModel<string | number>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="font-bold">{{ label }}</label>
    <div
      class="flex gap-2 border rounded px-2 py-1 w-min focus-within:outline-solid focus-within:outline-blue-700"
    >
      <textarea
        v-if="$attrs.type === 'textarea'"
        :id
        v-model="model"
        class="outline-none max-w-full"
        v-bind="$attrs"
      ></textarea>
      <input v-else :id v-model="model" class="outline-none max-w-full" v-bind="$attrs" />
      <div v-if="postFix" class="text-gray-400">{{ postFix }}</div>
    </div>

    <div v-if="error" class="text-sm text-red-500">{{ error }}</div>
  </div>
</template>
