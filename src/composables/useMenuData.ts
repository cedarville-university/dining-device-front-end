import * as Menus from '@/models/menus'
import * as Pioneer from '@/functions/pioneerMenu'
import { transformPioneerMenuToMenu } from '@/functions/transformers'
import { Temporal } from 'temporal-polyfill'
import { ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
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
  allergens: string[]
}

export default function useMenuData(
  startDate: MaybeRefOrGetter<
    Temporal.PlainDate | Temporal.PlainDateTime
  > = Temporal.Now.plainDateISO(),
) {
  const data = ref<Menu>()
  const loading = ref(false)
  const error = ref()

  const fetchMenu = async (date: string) => {
    try {
      let menuData = await Menus.get(date)
      if (!menuData) {
        loading.value = true
        menuData = (await Pioneer.fetchAndCache(date)) as TMenu
      }

      return menuData
    } catch (e) {
      error.value = e
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

  return {
    menu: data,
    fetchMenu,
    loading,
    error,
  }
}
