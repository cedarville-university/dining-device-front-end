import { Temporal } from 'temporal-polyfill'
import { normalizePioneerMenu, transformPioneerMenuToMenu } from './transformers'
import * as Menus from '@/models/menus'
import useConfiguration from '@/composables/useConfiguration'

const { apiUrl } = useConfiguration()

export interface PioneerMenu {
  date: string
  venues: PioneerVenue[]
}

export interface PioneerVenue {
  venue_name: string
  menu_items: string | PioneerMenuItem[]
}

export interface PioneerMenuItem {
  item_name: string
  allergens: string[]
}

export const get = async (startDate = Temporal.Now.plainDateISO().toString()) => {
  if (!apiUrl.value) return

  if (apiUrl.value.searchParams.has('startDate')) {
    apiUrl.value.searchParams.set('startDate', startDate)
  } else {
    apiUrl.value.searchParams.append('startDate', startDate)
  }

  if (apiUrl.value.searchParams.has('_t')) {
    apiUrl.value.searchParams.set('_t', Temporal.Now.instant().epochMilliseconds.toString())
  } else {
    apiUrl.value.searchParams.append('_t', Temporal.Now.instant().epochMilliseconds.toString())
  }

  const res = await fetch(apiUrl.value.href)
  const js = await res.text()

  return normalizePioneerMenu((new Function(`${js};return menuData;`)() as PioneerMenu[])?.[0])
}

export const fetchAndCache = async (startDate = Temporal.Now.plainDateISO().toString()) => {
  const pioneerData = await get(startDate)
  if (pioneerData) {
    return await Menus.store(transformPioneerMenuToMenu(pioneerData))
  }
}
