import type { Venue } from '@/composables/useMenuData'
import { db } from '@/db'

export const all = () => db.venues.toArray()

export const add = (venues: Venue[]) => {
  venues
    .filter((venue) => venue.name !== 'No Venues Found')
    .forEach(async (venue) => {
      const venueName = await db.venues.where('apiName').equals(venue.name).first()
      if (!venueName) {
        db.venues.add({ name: venue.name, apiName: venue.name })
      }
    })
}
