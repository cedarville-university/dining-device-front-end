import { Temporal } from 'temporal-polyfill'
import { normalizePioneerMenu, transformPioneerMenuToMenu } from './transformers'
import * as Menus from '@/models/menus'
import { storeToRefs } from 'pinia'
import { useConfigurationStore } from '@/stores/configurationStore'

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
  const { api } = storeToRefs(useConfigurationStore())

  if (!api.value?.url) return

  const apiUrl = new URL(api.value.url)

  if (apiUrl.searchParams.has('campus')) {
    apiUrl.searchParams.set('campus', api.value.campus)
  } else {
    apiUrl.searchParams.append('campus', api.value.campus)
  }

  if (apiUrl.searchParams.has('startDate')) {
    apiUrl.searchParams.set('startDate', startDate)
  } else {
    apiUrl.searchParams.append('startDate', startDate)
  }

  if (apiUrl.searchParams.has('_t')) {
    apiUrl.searchParams.set('_t', Temporal.Now.instant().epochMilliseconds.toString())
  } else {
    apiUrl.searchParams.append('_t', Temporal.Now.instant().epochMilliseconds.toString())
  }

  const controller = new AbortController()
  const timeout = 5000
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(apiUrl.href, { signal: controller.signal })
    clearTimeout(timeoutId)
    const js = await res.text()
    return normalizePioneerMenu((new Function(`${js};return menuData;`)() as PioneerMenu[])?.[0])
  } catch (error) {
    clearTimeout(timeoutId)
    console.error(error)
    throw error
  }
}

export const fetchAndCache = async (startDate = Temporal.Now.plainDateISO().toString()) => {
  try {
    const pioneerData = await get(startDate)

    if (!pioneerData) throw Error('Invalid menu data')
    if (pioneerData.venues?.[0].venue_name === 'No Venues Found')
      throw Error('No menu found for ' + startDate)

    // I don't want to store invalid menu data
    return await Menus.store(transformPioneerMenuToMenu(pioneerData))
  } catch (error) {
    throw error
  }
}
