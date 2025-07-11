import Dexie, { type EntityTable, type Transaction } from 'dexie'
import { Temporal } from 'temporal-polyfill'

interface TConfiguration {
  id: number
  auth: TAuth
  api: TApi
  orientation: 'portrait' | 'landscape'
  showBezel: boolean
  layout: TLayout
  device: TDevice
  menus: TConfigMenu[]
  refreshRates: TRefreshRate
}

interface TAuth {
  kiosk: string
  configuration: string
}

interface TRefreshRate {
  pioneer: number
  menu: number
  layout: number
}

interface TApi {
  url: string
  campus: string
}

interface TLayout {
  colors: TLayoutColors
  canvas: TLayoutConfig
  bezel: TLayoutConfig
  header: TLayoutConfig
}

interface TLayoutColors {
  primary: string
  secondary: string
  gray: string
}

interface TLayoutConfig {
  height?: number
  width?: number
  bgColor?: string
  color?: string
}

interface TDevice {
  id: number
  name: string
  model: string
  dimensions: TDeviceDimension[]
}

interface TDeviceDimension {
  orientation: 'portrait' | 'landscape'
  width: number
  height: number
}

interface TConfigMenu {
  venue: TVenueName
  layout: TLayoutComponent
  startTime: string
  endTime: string
}

interface TLayoutComponent {
  id: number
  name: string
  component: string
  description: string
}

interface TMenu {
  id: number
  date: string
  venues: TVenue[]
}

interface TVenue {
  id: number
  name: string
  items: TMenuItem[]
}

interface TMenuItem {
  id: number
  name: string
  allergens: string[]
}

interface TVenueName {
  id: number
  apiName: string
  name: string
}

const db = new Dexie('dining-menu') as Dexie & {
  configuration: EntityTable<TConfiguration, 'id'>
  menus: EntityTable<TMenu, 'id'>
  layouts: EntityTable<TLayoutComponent, 'id'>
  venues: EntityTable<TVenueName, 'id'>
  devices: EntityTable<TDevice, 'id'>
}

db.version(1).stores({
  configuration: '++id',
  menus: '++id, date',
  layouts: '++id, name',
  venues: '++id, apiName, name',
  devices: '++id',
})

db.on('populate', async (trans: Transaction) => {
  try {
    const deviceId = await trans.table('devices').add({
      id: 1,
      name: 'Mimo Adapt-IQV 10.1 Digital Signage Tablet',
      model: 'MCT-10HPQ',
      dimensions: [
        {
          orientation: 'landscape',
          width: 1280,
          height: 800,
        },
        {
          orientation: 'portrait',
          width: 800,
          height: 1280,
        },
      ],
    })

    const gridLayout = {
      id: 1,
      name: 'Grid Layout',
      component: 'GridLayout',
      description:
        'The grid layout renders the menu as a grid of cards. The number of columns and rows will be determined dynamically based on the number of menu items.',
    }
    await trans.table('layouts').add(gridLayout)

    const breakfast = { id: 1, apiName: 'Breakfast', name: 'Breakfast' }
    await trans.table('venues').add(breakfast)

    const lunch = { id: 2, apiName: 'Lunch Homecooking', name: 'Lunch Homecooking' }
    await trans.table('venues').add(lunch)

    const dinner = { id: 3, apiName: 'Dinner Homecooking', name: 'Dinner Homecooking' }
    await trans.table('venues').add(dinner)

    const soup = { id: 4, apiName: 'Soup of the Day', name: 'Soup of the Day' }
    await trans.table('venues').add(soup)

    const veggie = { id: 5, apiName: 'Vegetarian Bar', name: 'Vegetarian Bar' }
    await trans.table('venues').add(veggie)

    const menus: TConfigMenu[] = []
    let now = Temporal.Now.plainTimeISO()
    const venues = [breakfast, lunch, dinner, soup, veggie]
    let index = 0
    while (menus.length < 60) {
      const menuItem = {
        venue: venues[index],
        layout: gridLayout,
        startTime: '',
        endTime: '',
      }

      index = (index + 1) % venues.length

      menuItem.startTime = now.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      now = now.add({ minutes: 1 })
      menuItem.endTime = now.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      menus.push(menuItem)
    }

    await trans.table('configuration').add({
      id: 1,
      auth: {
        kiosk: '1234',
        configuration: '123456',
      },
      api: {
        url: import.meta.env.VITE_API_URL,
        campus: import.meta.env.VITE_API_CAMPUS,
      },
      orientation: 'landscape',
      showBezel: false,
      layout: {
        colors: {
          primary: '#003865',
          accent: '#fcb716',
          gray: '#efefef',
        },
        canvas: {
          bgColor: '#efefef',
          color: '#000000',
        },
        bezel: {
          width: 80,
          bgColor: '#000000',
        },
        header: {
          height: 75,
          bgColor: '#003865',
          color: '#ffffff',
        },
      },
      device: {
        id: deviceId,
        name: 'Mimo Adapt-IQV 10.1" Digital Signage Tablet',
        model: 'MCT-10HPQ',
        dimensions: [
          {
            orientation: 'landscape',
            width: 1280,
            height: 800,
          },
          {
            orientation: 'portrait',
            width: 800,
            height: 1280,
          },
        ],
      },
      // menus,
      menus: [
        {
          venue: breakfast,
          layout: gridLayout,
          startTime: '07:00',
          endTime: '10:00',
        },
        {
          venue: lunch,
          layout: gridLayout,
          startTime: '10:30',
          endTime: '14:00',
        },
        {
          venue: dinner,
          layout: gridLayout,
          startTime: '16:30',
          endTime: '20:00',
        },
      ],
      refreshRates: {
        layout: 5 * 1000, // five seconds
        menu: 1 * 60 * 60 * 1000, // ever hour
        pioneer: 6 * 60 * 60 * 1000, // every 6 hours
      },
    })
  } catch (error) {
    console.error('Error seeding db', error)
  }
})

export type {
  TMenu,
  TVenueName,
  TVenue,
  TMenuItem,
  TLayoutComponent,
  TConfiguration,
  TDevice,
  TDeviceDimension,
  TConfigMenu,
}
export { db }
