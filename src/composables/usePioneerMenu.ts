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
) {
  const rawPioneerMenuData = ref<PioneerMenu>()
  const menuData = ref<Menu>()

  const error = ref()
  const loading = ref(false)

  const { store } = useMenuData()

  const fetchAndStoreMenu = async (startDate = Temporal.Now.plainDateISO().toString()) => {
    loading.value = true

    const url = new URL('https://oncampusdining.com/api/menu/js/?campus=cedarville')

    url.searchParams.append('startDate', startDate)
    url.searchParams.append('_t', Temporal.Now.instant().epochMilliseconds.toString())

    return fetch(url.href)
      .then((res) => res.text())
      .then(async (js) => {
        rawPioneerMenuData.value = normalizePioneerMenu(
          (new Function(`${js};return menuData;`)() as PioneerMenu[])?.[0],
        )
        menuData.value = await store(transformPioneerMenuToMenu(rawPioneerMenuData.value))
        return menuData.value
      })
      .catch((e) => {
        error.value = e
        return e
      })
      .finally(() => {
        loading.value = false
      })
  }

  const date = computed(() => rawPioneerMenuData.value?.date)

  const menu = computed(() => rawPioneerMenuData.value)

  const venues = computed(() =>
    menu.value?.venues.map((venue) => ({
      ...venue,
      venue_name: venue.venue_name.trim(),
    })),
  )

  return {
    fetchAndStoreMenu,
    menuData,
    date,
    venues,
    error,
    loading,
  }
}
