import { db } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { computed, onMounted, ref, toValue, watch, watchEffect, type MaybeRef } from 'vue'

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

interface MenuItem {
  id?: number
  name: string
  allergens: string[]
}

export default function useMenuData() {
  const menuData = ref<Menu>()

  const menu = computed(() => menuData.value)
  const date = computed(() => menu.value?.date)
  const venues = computed(() => menu.value?.venues)

  const get = (date: string = Temporal.Now.plainDateISO().toString()) => {
    return db.menus
      .where('date')
      .equals(date)
      .first()
      .then((menu) => {
        menuData.value = menu
        return menu
      })
  }
  const add = (data: Menu) =>
    // @ts-ignore
    db.menus.add(data).then((menuId) => ({
      id: menuId,
      ...data,
    }))

  const store = async (data: Menu) => {
    return get(data.date).then((menu) => {
      if (!menu) {
        return add(data).then((menu) => {
          menuData.value = menu
          return menu
        })
      }
      return menu
    })
  }

  return {
    menu,
    date,
    venues,
    store,
    get,
  }
}
