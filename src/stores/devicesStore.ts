import { db, type TDevice } from '@/db'
import { deepUnref } from '@/functions/deepUnref'
import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { useConfigurationStore } from './configurationStore'
import { update } from '@/models/configuration'

export const useDevicesStore = defineStore('devices', () => {
  const devices = ref<TDevice[]>()
  onMounted(async () => (devices.value = await db.devices.toArray()))

  const create = async (data: Omit<TDevice, 'id'>) => {
    data = deepUnref(data)
    return db.devices.add(data).then((id) => {
      if (devices.value === undefined) {
        devices.value = []
      }

      devices.value = [
        ...devices.value,
        {
          id,
          ...data,
        },
      ]

      return id
    })
  }

  const update = async (id: number, data: TDevice) => {
    data = deepUnref(data)
    return db.devices.update(id, data as Partial<TDevice>).then((updated) => {
      if (updated) {
        const configuration = useConfigurationStore()
        if (configuration?.device?.id === id) {
          configuration.update({ device: data })
        }

        devices.value = devices.value?.map((device) => {
          if (device.id === id) {
            return {
              ...device,
              ...data,
            }
          }

          return device
        })
      }
    })
  }

  const del = (id: number) =>
    db.devices.delete(id).then((_) => {
      devices.value = devices.value?.filter((device) => device.id !== id)
    })

  return { devices, create, update, del }
})
