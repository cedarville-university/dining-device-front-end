import { Temporal } from 'temporal-polyfill'
import { computed, ref, toValue, watchEffect, type MaybeRef } from 'vue'

interface MenuData {
  date: string
  venues: Venue[]
}

interface Venue {
  venue_name: string
  menu_items: string | MenuItem[]
}

interface MenuItem {
  item_name: string
  allergens: string[]
}

export default function usePioneerMenu(
  startDateRef: MaybeRef<string | undefined> = undefined,
  endDateRef: MaybeRef<string | undefined> = undefined,
) {
  const menuData = ref<MenuData[]>()
  const error = ref()
  const loading = ref(false)

  watchEffect(() => {
    loading.value = true

    const url = new URL('https://oncampusdining.com/api/menu/js/?campus=cedarville')

    const startDate = toValue(startDateRef)
    if (startDate) {
      url.searchParams.append('startDate', startDate)
    }

    const endDate = toValue(endDateRef)
    if (endDate) {
      url.searchParams.append('endDate', endDate)
    }

    url.searchParams.append('_t', Temporal.Now.instant().epochMilliseconds.toString())

    fetch(url.href)
      .then((res) => res.text())
      .then((js) => {
        menuData.value = new Function(`${js};return menuData;`)()
      })
      .catch((e) => {
        error.value = e
      })
      .finally(() => {
        loading.value = false
      })
  })

  const date = computed(() => menuData.value?.[0]?.date)

  const menu = computed(() => menuData.value?.find((menus) => menus.date === date.value))

  const venues = computed(() => menu.value?.venues)

  return {
    menuData,
    date,
    venues,
    error,
    loading,
  }
}
