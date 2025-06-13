import type { Menu } from '@/composables/useMenu'
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

export const store = async (data: Menu) => {
  return get(data.date).then((menu) => {
    if (!menu) {
      return add(data)
    }
    return menu
  })
}
