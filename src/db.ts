import Dexie, { type EntityTable } from 'dexie'

interface Configuration {
  id: number
  orientation: 'portrait' | 'landscape'
  device: Device
  menus: ConfigMenu[]
}

interface Device {
  name: string
  model: string
  dimensions: DeviceDimension[]
}

interface DeviceDimension {
  orientation: 'portrait' | 'landscape'
  width: number
  height: number
}

interface ConfigMenu {
  name: string
  startTime: string
  endTime: string
}

interface Menu {
  id: number
  date: string
  venues: Venue[]
}

interface Venue {
  name: string
  items: MenuItem[]
}

interface MenuItem {
  name: string
  allergens: string[]
}

const db = new Dexie('dining-menu') as Dexie & {
  coniguration: EntityTable<Configuration, 'id'>
  menus: EntityTable<Menu, 'id'>
}
db.version(1).stores({
  menus: '++id, date',
  configuration: '++id',
})

export type { Menu, Venue, MenuItem, Configuration, Device, DeviceDimension, ConfigMenu }
export { db }
