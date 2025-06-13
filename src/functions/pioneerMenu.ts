import { Temporal } from 'temporal-polyfill'
import { normalizePioneerMenu } from './transformers'

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
  url.searchParams.append('startDate', startDate)
  url.searchParams.append('_t', Temporal.Now.instant().epochMilliseconds.toString())

  const res = await fetch(url.href)
  const js = await res.text()

  return normalizePioneerMenu((new Function(`${js};return menuData;`)() as PioneerMenu[])?.[0])
}
