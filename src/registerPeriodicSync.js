import { Temporal } from 'temporal-polyfill'
import * as Pioneer from '@/functions/pioneerMenu'

function registerPeriodicFetchPioneerMenu(registration) {
  registration.periodicSync
    .register('fetch-pioneer-menu', {
      // minInterval: 6 * 60 * 60 * 1000, // every 6 hours
      minInterval: 1 * 60 * 1000, // every minute
    })
    .then(() => {
      console.log('Periodic Sync registered')
    })
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

  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'fetch-pioneer-menu') {
      console.clear()
      const date = Temporal.Now.plainDateISO()
      console.log(`fetching data for ${date.toString()}`)
      event.waitUntil(Pioneer.fetchAndCache(date.toString()))
      console.log(`fetching data for ${date.add({ days: 1 }).toString()}`)
      event.waitUntil(Pioneer.fetchAndCache(date.add({ days: 1 }).toString()))
    }
  })
}
