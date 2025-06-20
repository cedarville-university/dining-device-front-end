import { db, type TVenueName, type TConfiguration, type TDevice } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { computed, ref } from 'vue'
import { get } from '@/models/configuration'
import { all as allVenues } from '@/models/venues'

export default function useConfiguration() {
  const configuration = ref<TConfiguration>()

  get().then((conf) => (configuration.value = conf))

  const hasConfig = computed(() => !!configuration?.value)

  const orientation = computed(() => configuration.value?.orientation)

  const possibleVenues = ref<TVenueName[]>()
  allVenues().then((v) => {
    possibleVenues.value = v
  })

  const allMenus = computed(() =>
    configuration.value?.menus.map((menu) => {
      const venueName = possibleVenues.value?.find((v) => v.id === menu.venueId)
      return {
        ...menu,
        venueName,
      }
    }),
  )

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

  const apiUrl = computed(() => {
    if (configuration.value)
      return new URL(`${configuration.value.api.url}?campus=${configuration.value.api.campus}`)
  })

  return {
    auth,
    apiUrl,
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
