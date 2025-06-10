import type { Configuration } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { computed, onMounted, ref } from 'vue'

const configurationData: Configuration = {
  id: 1,
  orientation: 'landscape',
  device: {
    name: 'Mimo Adapt-IQV 10.1" Digital Signage Tablet',
    model: 'MCT-10HPQ',
    dimensions: [
      {
        orientation: 'landscape',
        width: 1280,
        height: 800,
      },
      {
        orientation: 'portrait',
        width: 800,
        height: 1280,
      },
    ],
  },
  menus: [
    {
      name: 'Lunch Homecooking',
      startTime: '10:00',
      endTime: '14:00',
    },
    {
      name: 'Dinner Homecooking',
      startTime: '16:30',
      endTime: '22:00',
    },
  ],
}

export default function useConfiguration() {
  const configuration = ref<Configuration>()
  onMounted(() => {
    Promise.resolve(configurationData).then((config) => {
      configuration.value = config
    })
  })

  const hasConfig = computed(() => !!configuration?.value)

  const orientation = computed(() => configuration.value?.orientation)

  const allMenus = computed(() => configuration.value?.menus)
  const activeMenus = computed(() => {
    const now = Temporal.Now.plainTimeISO().toString()

    return allMenus.value?.filter((menu) => {
      const startTime = Temporal.PlainTime.from(menu.startTime)
      const endTime = Temporal.PlainTime.from(menu.endTime)
      return (
        Temporal.PlainTime.compare(now, startTime) !== -1 &&
        Temporal.PlainTime.compare(endTime, now) !== -1
      )
    })
  })

  const device = computed(() => configuration.value?.device)
  const deviceDimension = computed(() =>
    device.value?.dimensions?.find((dim) => dim.orientation === orientation.value),
  )

  return {
    configuration,
    hasConfig,
    orientation,
    device,
    deviceDimension,
    allMenus,
    activeMenus,
  }
}
