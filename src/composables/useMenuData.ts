import * as Menus from '@/models/menus'
import * as Pioneer from '@/functions/pioneerMenu'
import { transformPioneerMenuToMenu } from '@/functions/transformers'
import { Temporal } from 'temporal-polyfill'
import { computed, ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import type { TMenu } from '@/db'

export interface Menu {
  id?: number
  date: string
  venues: Venue[]
}

export interface Venue {
  id?: number
  name: string
  items: MenuItem[]
}

export interface MenuItem {
  id?: number
  name: string
  isMainDish?: boolean
  allergens: string[]
}

export const isValidMenu = (menuData: Menu) => {
  return !menuData.venues.every((venue) => venue.name === 'No Venues Found')
}

export default function useMenuData(
  startDate: MaybeRefOrGetter<
    Temporal.PlainDate | Temporal.PlainDateTime
  > = Temporal.Now.plainDateISO(),
) {
  const data = ref<Menu>()
  const loading = ref(false)
  const error = ref()

  const fetchMenu = async (date: string, forceFetchAndCache = false) => {
    try {
      let menuData = await Menus.get(date)

      if (forceFetchAndCache || !menuData) {
        loading.value = true
        menuData = (await Pioneer.fetchAndCache(date)) as TMenu
      } else if (!isValidMenu(menuData)) {
        loading.value = true
        Pioneer.fetchAndCache(date)
          .then((menuData) => {
            if (isValidMenu(menuData)) {
              console.log(menuData)
              data.value = menuData
            }
          })
          .finally(() => (loading.value = false))
      }

      error.value = undefined
      return menuData
    } catch (e) {
      error.value = `No venues found for ${date}`
      throw e
    } finally {
      loading.value = false
    }
  }

  watchEffect(async () => {
    let date = toValue(startDate)
    if (date instanceof Temporal.PlainDateTime) {
      date = date.toPlainDate()
    }

    data.value = await fetchMenu(date.toString())
  })

  const venues = computed(() => data.value?.venues)

  return {
    menu: data,
    venues,
    fetchMenu,
    loading,
    error,
  }
}
