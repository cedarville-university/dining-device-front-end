import { onMounted, onUnmounted, ref } from 'vue'
import { fetchAndCache as PioneerFetchAndCache } from '@/functions/pioneerMenu'
import { Temporal } from 'temporal-polyfill'

export default function useScheduledPioneerMenuSync(
  daysToFetch = 5,
  refreshRate = 6 * 60 * 60 * 1000,
) {
  const paused = ref(!navigator.onLine)
  let timeout = -1

  const pause = () => {
    if (!paused.value) {
      if (timeout > -1) clearTimeout(timeout)
      paused.value = true
    }
  }
  const resume = () => {
    if (paused.value) {
      paused.value = false
      sync()
    }
  }

  const sync = () => {
    requestIdleCallback(async () => {
      const date = Temporal.Now.plainDateISO()
      for (const day of [...new Array(daysToFetch + 1)].map((_, i) => i)) {
        PioneerFetchAndCache(date.add({ days: day }).toString())
      }

      timeout = setTimeout(sync, refreshRate)
    })
  }
  onMounted(() => {
    if (!paused.value) {
      sync()
    }

    window.addEventListener('blur', pause)
    window.addEventListener('focus', resume)

    window.addEventListener('offline', pause)
    window.addEventListener('online', resume)
  })

  onUnmounted(() => {
    pause()

    window.removeEventListener('blur', pause)
    window.removeEventListener('focus', resume)

    window.removeEventListener('offline', pause)
    window.removeEventListener('online', resume)
  })

  return {
    pause,
    resume,
  }
}
