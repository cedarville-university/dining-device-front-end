import { Temporal } from 'temporal-polyfill'
import { normalizePioneerMenu, transformPioneerMenuToMenu } from './transformers'
import * as Menus from '@/models/menus'

const url = new URL('https://oncampusdining.com/api/menu/js/?campus=cedarville')

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
  if (url.searchParams.has('startDate')) {
    url.searchParams.set('startDate', startDate)
  } else {
    url.searchParams.append('startDate', startDate)
  }

  if (url.searchParams.has('_t')) {
    url.searchParams.set('_t', Temporal.Now.instant().epochMilliseconds.toString())
  } else {
    url.searchParams.append('_t', Temporal.Now.instant().epochMilliseconds.toString())
  }

  const res = await fetch(url.href)
  const js = await res.text()

  return normalizePioneerMenu((new Function(`${js};return menuData;`)() as PioneerMenu[])?.[0])
}

export const fetchAndCache = async (startDate = Temporal.Now.plainDateISO().toString()) => {
  const pioneerData = await get(startDate)
  if (pioneerData) {
    return await Menus.store(transformPioneerMenuToMenu(pioneerData))
  }
}
