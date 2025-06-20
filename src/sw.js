import { precacheAndRoute } from 'workbox-precaching'
import { Temporal } from 'temporal-polyfill'
import * as Pioneer from '@/functions/pioneerMenu'

precacheAndRoute(self.__WB_MANIFEST)

function registerPeriodicFetchPioneerMenu() {
  navigator.serviceWorker.ready
    .then((registration) => {
      console.log(registration)
      registration.periodicSync
        .register('fetch-pioneer-menu', {
          minInterval: 6 * 60 * 60 * 1000, // every 6 hours
        })
        .then(() => {
          console.log('Periodic Sync registered')
        })
    })
    .catch(console.error)
}

navigator.permissions
  .query({
    name: 'periodic-background-sync',
  })
  .then((status) => {
    if (status.state === 'granted') {
      // Continue registering the periodic sync
      registerPeriodicFetchPioneerMenu()
    } else {
      console.log('not granted')
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
