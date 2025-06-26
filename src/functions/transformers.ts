import type { Menu } from '@/composables/useMenuData'
import type { PioneerMenu } from './pioneerMenu'

export function normalizeMenu(menuData: Menu): Menu {
  return {
    date: menuData.date,
    venues: menuData.venues.map((venue) => ({
      ...venue,
      name: venue.name.trim(),
      items: venue.items.map((item) => ({
        ...item,
        name: item.name.trim(),
        allergens: item.allergens.map((url) => url.trim()),
      })),
    })),
  }
}

export function normalizePioneerMenu(menuData: PioneerMenu): PioneerMenu {
  return {
    date: menuData.date.trim(),
    venues: menuData.venues.map((venue) => {
      if (typeof venue.menu_items === 'string') {
        return {
          venue_name: venue.venue_name.trim(),
          menu_items: venue.menu_items.trim(),
        }
      }

      return {
        venue_name: venue.venue_name.trim(),
        menu_items: venue.menu_items.map((item) => ({
          item_name: item.item_name.trim(),
          allergens: [...item.allergens.map((url) => url.trim())],
        })),
      }
    }),
  }
}

export function transformPioneerMenuToMenu(menuData: PioneerMenu): Menu {
  return normalizeMenu({
    date: menuData.date,
    venues: menuData.venues.map((venue) => {
      if (typeof venue.menu_items === 'string') {
        return {
          name: venue.venue_name,
          items: [{ name: venue.menu_items, allergens: [] }],
        }
      }

      return {
        name: venue.venue_name,
        items: venue.menu_items.map((item) => ({
          name: item.item_name,
          allergens: [...item.allergens],
        })),
      }
    }),
  })
}
