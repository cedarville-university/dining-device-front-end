import { onMounted, onUnmounted, ref, watch, watchEffect, type ComputedRef } from 'vue'
import { fetchAndCache as PioneerFetchAndCache } from '@/functions/pioneerMenu'
import { Temporal } from 'temporal-polyfill'
import { useConfigurationStore } from '@/stores/configurationStore'
import { storeToRefs } from 'pinia'

export default function useScheduledPioneerMenuSync(daysToFetch = 5) {
  const { pioneerRefreshRate } = storeToRefs(useConfigurationStore())

  const paused = ref(!navigator.onLine)
  let timeout = -1
  const isRegistered = ref(false)

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
    if (!pioneerRefreshRate.value) return

    requestIdleCallback(async () => {
      const date = Temporal.Now.plainDateISO()
      for (const day of [...new Array(daysToFetch + 1)].map((_, i) => i)) {
        PioneerFetchAndCache(date.add({ days: day }).toString())
      }

      timeout = setTimeout(sync, pioneerRefreshRate.value)
    })
  }

  const unwatch = watchEffect(() => {
    if (pioneerRefreshRate.value) {
      if (isRegistered.value) {
        unwatch()
      } else {
        if (!paused.value) {
          sync()
        }

        window.addEventListener('blur', pause)
        window.addEventListener('focus', resume)

        window.addEventListener('offline', pause)
        window.addEventListener('online', resume)

        isRegistered.value = true
      }
    }
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
