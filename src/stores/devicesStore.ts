import { db, type TDevice } from '@/db'
import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

export const useDevicesStore = defineStore('devices', () => {
  const devices = ref<TDevice[]>()
  onMounted(async () => (devices.value = await db.devices.toArray()))

  return { devices }
})
