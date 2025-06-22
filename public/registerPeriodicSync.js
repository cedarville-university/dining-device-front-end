importScripts('./functions/pioneer.ts')

function registerPeriodicFetchPioneerMenu() {
  console.log('checking if serviceWorker is ready')
  navigator.serviceWorker.ready
    ?.then((registration) => {
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
      console.log('granted')
      registerPeriodicFetchPioneerMenu()
    } else {
      console.log('not granted')
    }
  })

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'fetch-pioneer-menu') {
    console.clear()
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0')

    const formattedToday = `${year}-${month}-${day}`

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1) // Increment the day by 1

    const tomorrowYear = tomorrow.getFullYear()
    const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0')
    const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0')

    const formattedTomorrow = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`

    console.log(`fetching data for ${formattedToday}`)
    event.waitUntil(fetchAndCache(formattedToday))
    console.log(`fetching data for ${formattedTomorrow}`)
    event.waitUntil(fetchAndCache(formattedTomorrow))
  }
})
