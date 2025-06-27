<script setup lang="ts" generic="T">
import { useId } from 'vue'

interface ValueLabel<U> {
  label: string
  value: U
}

interface Props {
  id?: string
  label: string
  help?: string
  options: ValueLabel<T>[] | string[]
}

const { id = useId() } = defineProps<Props>()

const model = defineModel<T>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex justify-between items-end">
      <label :for="id" class="font-bold">{{ label }}</label>
      <span
        v-if="help"
        class="text-[0.8em] pt-0.5 px-1 rounded [background-color:color-mix(in_oklch,currentColor,transparent_85%)] [color:color-mix(in_oklch,currentColor,transparent_45%)]"
      >
        {{ help }}
      </span>
    </div>
    <select
      :id
      v-model="model"
      class="border rounded px-2 py-1 focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-(--secondary-color)"
    >
      <template v-for="option in options">
        <option
          v-if="typeof option === 'object' && 'value' in option && 'label' in option"
          :value="option.value"
          :key="String(option.value)"
        >
          {{ option.label }}
        </option>
        <option v-else>{{ option }}</option>
      </template>
    </select>
  </div>
</template>
