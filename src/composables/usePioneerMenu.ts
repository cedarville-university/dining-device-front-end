import { Temporal } from 'temporal-polyfill'
import { computed, ref, toValue, watchEffect, type MaybeRef } from 'vue'
import useMenuData, { type Menu } from './useMenuData'
import { normalizePioneerMenu, transformPioneerMenuToMenu } from '@/functions/transformers'

export interface PioneerMenu {
  date: string
  venues: PioneerVenue[]
}

export interface PioneerVenue {
  venue_name: string
  menu_items: string | PioneerMenuItem[]
}

interface PioneerMenuItem {
  item_name: string
  allergens: string[]
}

export default function usePioneerMenu(
  startDateRef: MaybeRef<string | undefined> = Temporal.Now.plainDateISO().toString(),
  endDateRef: MaybeRef<string | undefined> = Temporal.Now.plainDateISO().toString(),
) {
  const rawPioneerMenuData = ref<PioneerMenu[]>()
  const menuData = ref<Menu[]>()

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
      .then(
        (js) =>
          (rawPioneerMenuData.value = (
            new Function(`${js};return menuData;`)() as PioneerMenu[]
          ).map(normalizePioneerMenu)),
      )
      .catch((e) => {
        error.value = e
      })
      .finally(() => {
        loading.value = false
      })
  })

  const date = computed(() => rawPioneerMenuData.value?.[0]?.date)

  const menu = computed(() => rawPioneerMenuData.value?.find((menus) => menus.date === date.value))

  const venues = computed(() =>
    menu.value?.venues.map((venue) => ({
      ...venue,
      venue_name: venue.venue_name.trim(),
    })),
  )

  return {
    menuData,
    date,
    venues,
    error,
    loading,
  }
}
