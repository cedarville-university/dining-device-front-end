import { db, type TConfiguration } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { computed, onMounted, ref } from 'vue'

const configurationData: TConfiguration = {
  id: 1,
  orientation: 'landscape',
  layout: {
    component: 'GridLayout',
    canvas: {
      bgColor: '#003865',
    },
    bezel: {
      width: 80,
      bgColor: '#000000',
    },
    header: {
      height: 75,
      bgColor: '#003865',
      color: '#ffffff',
    },
  },
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
      endTime: '15:30',
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

  // const orientation = computed(() => configuration.value?.orientation)
  const orientation = computed(() => 'landscape')

  const allMenus = computed(() => configuration.value?.menus)
  const activeMenu = computed(() => {
    const now = Temporal.Now.plainTimeISO().toString()

    return allMenus.value?.find((menu) => {
      const startTime = Temporal.PlainTime.from(menu.startTime)
      const endTime = Temporal.PlainTime.from(menu.endTime)
      return (
        Temporal.PlainTime.compare(now, startTime) !== -1 &&
        Temporal.PlainTime.compare(endTime, now) !== -1
      )
    })
  })
  const upcomingMenu = computed(() => {
    const now = Temporal.Now.plainTimeISO().toString()

    return allMenus.value?.find((menu) => {
      const startTime = Temporal.PlainTime.from(menu.startTime)
      return Temporal.PlainTime.compare(now, startTime) === -1
    })
  })

  const device = computed(() => configuration.value?.device)
  const deviceDimension = computed(() =>
    device.value?.dimensions?.find((dim) => dim.orientation === orientation.value),
  )

  const layout = computed(() => configuration.value?.layout)

  return {
    configuration,
    hasConfig,
    orientation,
    layout,
    device,
    deviceDimension,
    allMenus,
    activeMenu,
    upcomingMenu,
  }
}
