import Dexie, { type EntityTable } from 'dexie'

interface TConfiguration {
  id: number
  orientation: 'portrait' | 'landscape'
  device: TDevice
  menus: TConfigMenu[]
}

interface TDevice {
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
  name: string
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
  items: TMenuItem
}

interface TMenuItem {
  id: number
  name: string
  allergens: string[]
}

const db = new Dexie('dining-menu') as Dexie & {
  configuration: EntityTable<TConfiguration, 'id'>
  menus: EntityTable<TMenu, 'id'>
}

db.version(1).stores({
  configuration: '++id',
  menus: '++id, date', // Table for dates
})

export type { TMenu, TVenue, TMenuItem, TConfiguration, TDevice, TDeviceDimension, TConfigMenu }
export { db }
