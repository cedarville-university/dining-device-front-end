import Dexie, { type EntityTable } from 'dexie'

interface TConfiguration {
  id: number
  auth: TAuth
  orientation: 'portrait' | 'landscape'
  showBezel: boolean
  layout: TLayout
  device: TDevice
  menus: TConfigMenu[]
}

interface TAuth {
  kiosk: string
  configuration: string
}

interface TLayout {
  component: 'GridLayout'
  canvas: TLayoutConfig
  bezel: TLayoutConfig
  header: TLayoutConfig
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
  items: TMenuItem[]
}

interface TMenuItem {
  id: number
  name: string
  allergens: string[]
}

interface TVenueName {
  id: number
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
  venues: '++id, name',
  devices: '++id',
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
