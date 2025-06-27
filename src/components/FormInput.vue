<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  id?: string
  label: string
  help?: string
  error?: string
  postFix?: string
}

const { id = useId() } = defineProps<Props>()

const model = defineModel<string | number>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex justify-between items-center">
      <label :for="id" class="font-bold">{{ label }}</label>
      <span
        v-if="help"
        class="text-[0.8em] pt-0.5 px-1 rounded [background-color:color-mix(in_oklch,currentColor,transparent_85%)] [color:color-mix(in_oklch,currentColor,transparent_45%)]"
        >{{ help }}</span
      >
    </div>
    <div
      class="flex gap-2 border rounded px-2 py-1 w-min focus-within:outline-1 focus-within:outline-solid focus-within:outline-(--secondary-color)"
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
