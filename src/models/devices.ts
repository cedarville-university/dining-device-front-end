import { db, type TDevice } from '@/db'
import { deepUnref } from '@/functions/deepUnref'

export const count = () => db.devices.count()
export const all = () => db.devices.toArray()

export const add = (device: TDevice) => db.devices.add(deepUnref(device))
