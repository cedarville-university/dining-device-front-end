import { type TConfiguration, type TDevice } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { computed, onMounted, ref } from 'vue'
import * as Config from '@/models/configuration'
import * as Device from '@/models/devices'

const deviceData: TDevice[] = [
  {
    id: 1,
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
]

const configurationData: TConfiguration = {
  id: 1,
  auth: {
    kiosk: '1234',
    configuration: '123456',
  },
  orientation: 'landscape',
  showBezel: false,
  layout: {
    component: 'GridLayout',
    canvas: {
      bgColor: '#efefef',
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
    id: 1,
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
    // load devices
    if ((await Device.count()) === 0) {
      deviceData.forEach(async (device) => await Device.add(device))
    }

    configuration.value = await Config.get()
    if (!configuration.value) {
      await Config.add(configurationData)
      configuration.value = await Config.get()
    }
  }

  init()

  const hasConfig = computed(() => !!configuration?.value)

  const orientation = computed(() => configuration.value?.orientation)

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

  const auth = computed(() => configuration.value?.auth)

  const showBezel = computed(() => configuration.value?.showBezel)

  return {
    auth,
    configuration,
    hasConfig,
    orientation,
    layout,
    device,
    deviceDimension,
    allMenus,
    activeMenu,
    upcomingMenu,
    showBezel,
  }
}
