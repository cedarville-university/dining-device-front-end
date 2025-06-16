<script setup lang="ts" generic="T extends string">
import { useId } from 'vue'

interface ValueLabel<U> {
  label: string
  value: U
}

interface Props {
  id?: string
  label: string
  options: ValueLabel<T>[] | string[]
}

const { id = useId() } = defineProps<Props>()

const model = defineModel<T>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="font-bold">{{ label }}</label>
    <select :id v-model="model" class="border rounded px-2 py-1">
      <template v-for="option in options">
        <option
          v-if="typeof option === 'object' && 'value' in option && 'label' in option"
          :value="option.value"
          :key="option.value"
        >
          {{ option.label }}
        </option>
        <option v-else>{{ option }}</option>
      </template>
    </select>
  </div>
</template>
