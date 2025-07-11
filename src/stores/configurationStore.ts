import { db, type TConfigMenu, type TConfiguration } from '@/db'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { Temporal } from 'temporal-polyfill'
import { deepUnref } from '@/functions/deepUnref'

export const useConfigurationStore = defineStore('configuration', () => {
  const configuration = ref<TConfiguration>()

  const loadConfiguration = async () => {
    configuration.value = await db.configuration.get(1)
  }

  loadConfiguration()

  const update = (config: { [P in keyof TConfiguration]+?: TConfiguration[P] }) =>
    db.configuration.update(1, deepUnref(config)).then(loadConfiguration)

  const orientation = computed(() => configuration.value?.orientation)

  const device = computed(() => configuration.value?.device)
  const dimensions = computed(() =>
    device.value?.dimensions.find((dim) => dim.orientation === orientation.value),
  )

  const deviceHeight = computed(() => dimensions.value?.height ?? 0)
  const deviceWidth = computed(() => dimensions.value?.width ?? 0)

  const refreshRates = computed(() => configuration.value?.refreshRates)

  const layoutRefreshRate = computed(() => refreshRates.value?.layout)
  const menuRefreshRate = computed(() => refreshRates.value?.menu)
  const pioneerRefreshRate = computed(() => refreshRates.value?.pioneer)

  const layout = computed(() => configuration.value?.layout)
  const primaryColor = computed(() => layout.value?.colors.primary ?? '#003865')
  const primaryTextColor = computed(() => layout.value?.colors.primaryText ?? '#ffffff')
  const secondaryColor = computed(() => layout.value?.colors.secondary ?? '#fcb716')
  const secondaryTextColor = computed(() => layout.value?.colors.secondaryText ?? '#ffffff')
  const grayColor = computed(() => layout.value?.colors.gray ?? '#efefef')
  const grayTextColor = computed(() => layout.value?.colors.grayText ?? '#333333')

  const headerHeight = computed(() => layout.value?.header.height ?? 0)
  const headerBg = computed(() => layout.value?.header.bgColor ?? '#003865')
  const headerColor = computed(() => layout.value?.header.color ?? 'var(--color-white)')

  const viewHeight = computed(() => deviceHeight.value - headerHeight.value)
  const viewWidth = computed(() => deviceWidth.value)

  const canvasBg = computed(() => layout.value?.canvas.bgColor ?? 'var(--color-gray-100)')
  const canvasColor = computed(() => layout.value?.canvas.color ?? 'inherit')

  const showBezel = computed(() => configuration.value?.showBezel)
  const bezelWidth = computed(() => (showBezel.value ? (layout.value?.bezel.width ?? 0) : 0))
  const bezelBg = computed(() => layout.value?.bezel.bgColor ?? 'var(--color-black)')
  const bezelRadius = computed(() => bezelWidth.value / 2)

  const menus = computed(() => {
    return configuration.value?.menus
      .map((menu) => {
        return {
          ...menu,
          startTimeObject: Temporal.PlainTime.from(menu.startTime),
          endTimeObject: Temporal.PlainTime.from(menu.endTime),
        } as TConfigMenu & {
          startTimeObject: Temporal.PlainTime
          endTimeObject: Temporal.PlainTime
        }
      })
      .sort((menuA, menuB) =>
        Temporal.PlainTime.compare(menuA.startTimeObject, menuB.startTimeObject),
      )
  })

  const auth = computed(() => configuration.value?.auth)

  const api = computed(() => configuration.value?.api)

  return {
    // actions
    update,
    // getters
    orientation,
    device,
    deviceDimensions: dimensions,
    deviceHeight,
    deviceWidth,
    refreshRates,
    layoutRefreshRate,
    menuRefreshRate,
    pioneerRefreshRate,
    layout,
    primaryColor,
    primaryTextColor,
    secondaryColor,
    secondaryTextColor,
    grayColor,
    grayTextColor,
    headerHeight,
    headerBg,
    headerColor,
    viewHeight,
    viewWidth,
    canvasBg,
    canvasColor,
    showBezel,
    bezelWidth,
    bezelBg,
    bezelRadius,
    menus,
    auth,
    api,
  }
})
