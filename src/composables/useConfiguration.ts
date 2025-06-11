import { db, type TConfiguration } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { computed, onMounted, ref } from 'vue'

const configurationData: TConfiguration = {
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
      startTime: '08:00',
      endTime: '14:00',
    },
    {
      name: 'Dinner Homecooking',
      startTime: '15:30',
      endTime: '23:59',
    },
  ],
}

export default function useConfiguration() {
  const configuration = ref<TConfiguration>()

  async function init() {
    configuration.value = await db.configuration.limit(1).first()
    if (!configuration.value) {
      await db.configuration.add(configurationData)
      configuration.value = await db.configuration.limit(1).first()
    }
  }

  init()

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
