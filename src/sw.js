import { skipWaiting, clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { handlePeriodicSyncReg } from './registerPeriodicSync'
import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { registerRoute } from 'workbox-routing'
import { NetworkOnly } from 'workbox-strategies'
import { pageCache, staticResourceCache } from 'workbox-recipes'

pageCache()
staticResourceCache()

// self.__WB_MANIFEST is the precache manifest generated by the plugin
precacheAndRoute(self.__WB_MANIFEST)

skipWaiting()
clientsClaim()

const bgSyncPlugin = new BackgroundSyncPlugin('retry-pioneer-fetch', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 hours (specified in minutes)
})

registerRoute(
  new RegExp(import.meta.env.VITE_API_URL),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'GET',
)

self.addEventListener('activate', (event) => {
  handlePeriodicSyncReg(event.target.registration)
})
