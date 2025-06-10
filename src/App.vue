<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import usePioneerMenu from './composables/usePioneerMenu'
import { onMounted, ref } from 'vue'
import useConfiguration from './composables/useConfiguration'
import { useRouter } from 'vue-router'
import DeviceLayout from './layouts/DeviceLayout.vue'
import RequestFullscreen from './components/RequestFullscreen.vue'

const day = ref(Temporal.Now.plainDateISO())
const startDate = ref<string>(day.value.toString())
const { menuData, date, venues, loading } = usePioneerMenu(startDate)

const prevDay = () => {
  day.value = day.value.subtract({ days: 1 })
  startDate.value = day.value.toString()
}
const nextDay = () => {
  day.value = day.value.add({ days: 1 })
  startDate.value = day.value.toString()
}

const { hasConfig, deviceDimension } = useConfiguration()

const router = useRouter()
onMounted(() => {
  if (!hasConfig) {
    router.push('/config')
  }
})
</script>

<template>
  <RequestFullscreen>
    <div class="min-h-dvh grid place-content-center">
      <span v-if="!deviceDimension">This device has not been configured</span>
      <DeviceLayout v-else :device-dimension show-bezels>
        <RouterView />
      </DeviceLayout>
    </div>
  </RequestFullscreen>
</template>
