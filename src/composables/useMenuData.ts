import { db } from '@/db'
import { onMounted, ref } from 'vue'

export interface Menu {
  id?: number
  date: string
  venues: Venue[]
}

interface Venue {
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

  const store = async (menuData: Menu) => {
    let menu = await db.menus.where('date').equals(menuData.date).first()
    if (!menu) {
      // @ts-ignore
      await db.menus.add(menuData)
    }
  }

  return {
    menuData,
    store,
  }
}
