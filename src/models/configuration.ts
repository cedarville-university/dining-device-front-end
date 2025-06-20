import { db, type TConfigMenu, type TConfiguration } from '@/db'
import { deepUnref } from '@/functions/deepUnref'

export const get = () => db.configuration.where('id').equals(1).first()

export const add = (config: TConfiguration) => db.configuration.add(config)

export const update = (config: TConfiguration) => db.configuration.put(deepUnref(config))

export const updateMenus = (config: TConfiguration, menus: TConfigMenu[]) =>
  db.configuration.put(
    deepUnref({
      ...config,
      menus,
    }),
  )
