import { type Menu } from '@/composables/useMenuData'
import { db } from '@/db'
import { Temporal } from 'temporal-polyfill'
import * as Venue from './venues'

export const get = async (date = Temporal.Now.plainDateISO().toString()) =>
  await db.menus.where('date').equals(date.toString()).first()

export const add = (data: Menu) =>
  // @ts-ignore
  db.menus.add(data).then((menuId) => ({
    id: menuId,
    ...data,
  }))

export const update = (id: number, data: Menu) => {
  // @ts-ignore
  db.menus.update(id, data)
  return data
}

export const store = async (data: Menu) => {
  return get(data.date).then((menu) => {
    Venue.add(data.venues)
    if (!menu) {
      return add(data)
    }

    return update(menu.id, data)
  })
}
