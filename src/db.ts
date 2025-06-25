import Dexie, { type EntityTable, type Transaction } from 'dexie'

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
  component: 'GridLayout'
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
  venueId: number
  startTime: string
  endTime: string
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
  venues: EntityTable<TVenueName, 'id'>
  devices: EntityTable<TDevice, 'id'>
}

db.version(1).stores({
  configuration: '++id',
  menus: '++id, date',
  venues: '++id, apiName, name',
  devices: '++id',
})

db.on('populate', async (trans: Transaction) => {
  try {
    const deviceId = await trans.table('devices').add({
      id: 1,
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
    })

    const breakfastId = await trans.table('venues').add({ apiName: 'Breakfast', name: 'Breakfast' })
    const lunchId = await trans
      .table('venues')
      .add({ apiName: 'Lunch Homecooking', name: 'Lunch Homecooking' })
    const dinnerId = await trans
      .table('venues')
      .add({ apiName: 'Dinner Homecooking', name: 'Dinner Homecooking' })
    const soupId = await trans
      .table('venues')
      .add({ apiName: 'Soup of the Day', name: 'Soup of the Day' })
    const veggieId = await trans
      .table('venues')
      .add({ apiName: 'Vegetarian Bar', name: 'Vegetarian Bar' })

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
        component: 'GridLayout',
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
      menus: [
        {
          venueId: breakfastId,
          startTime: '07:00',
          endTime: '10:00',
        },
        {
          venueId: lunchId,
          startTime: '10:30',
          endTime: '14:00',
        },
        {
          venueId: dinnerId,
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
  TConfiguration,
  TDevice,
  TDeviceDimension,
  TConfigMenu,
}
export { db }
