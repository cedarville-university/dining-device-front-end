import type { Menu, Venue } from '@/composables/useMenuData'
import { db } from '@/db'
import { Temporal } from 'temporal-polyfill'

export const get = async (date = Temporal.Now.plainDateISO().toString()) =>
  await db.menus.where('date').equals(date.toString()).first()

export const add = (data: Menu) =>
  // @ts-ignore
  db.menus.add(data).then((menuId) => ({
    id: menuId,
    ...data,
  }))

const addToVenues = (venues: Venue[]) => {
  venues
    .filter((venue) => venue.name !== 'No Venues Found')
    .forEach(async (venue) => {
      const venueName = await db.venues.where('name').equals(venue.name).first()
      if (!venueName) {
        db.venues.add({ name: venue.name, apiName: venue.name })
      }
    })
}

export const store = async (data: Menu) => {
  return get(data.date).then((menu) => {
    if (!menu) {
      addToVenues(data.venues)
      return add(data)
    }
    return menu
  })
}
