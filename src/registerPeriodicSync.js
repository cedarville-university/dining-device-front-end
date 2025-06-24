import { Temporal } from 'temporal-polyfill'
import * as Pioneer from '@/functions/pioneerMenu'

function registerPeriodicFetchPioneerMenu(registration) {
  registration.periodicSync
    .register('fetch-pioneer-menu', {
      minInterval: 24 * 60 * 60 * 1000, // try to do a periodic sync at least once every 24 hours
    })
    .catch(console.error)
}

export function handlePeriodicSyncReg(registration) {
  navigator.permissions
    .query({
      name: 'periodic-background-sync',
    })
    .then((status) => {
      if (status.state === 'granted') {
        registerPeriodicFetchPioneerMenu(registration)
      }
    })

  // I'm going to fetch the current day plus 5 more future days
  // I'm not sure if and when the periodic sync will run on the devices
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'fetch-pioneer-menu') {
      const date = Temporal.Now.plainDateISO()
      event.waitUntil(Pioneer.fetchAndCache(date.toString()))
      event.waitUntil(Pioneer.fetchAndCache(date.add({ days: 1 }).toString()))
      event.waitUntil(Pioneer.fetchAndCache(date.add({ days: 2 }).toString()))
      event.waitUntil(Pioneer.fetchAndCache(date.add({ days: 3 }).toString()))
      event.waitUntil(Pioneer.fetchAndCache(date.add({ days: 4 }).toString()))
      event.waitUntil(Pioneer.fetchAndCache(date.add({ days: 5 }).toString()))
    }
  })
}
