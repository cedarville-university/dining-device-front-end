import type { TMenu } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { onUnmounted, ref, watch, watchEffect } from 'vue'
import type { Menu } from './useMenu'
import { fetchAndCache as pioneerFetchAndCache } from '@/functions/pioneerMenu'
import { get as menuGet } from '@/models/menus'
import { storeToRefs } from 'pinia'
import { useConfigurationStore } from '@/stores/configurationStore'

export default function useScheduledMenuSync() {
  const { menuRefreshRate } = storeToRefs(useConfigurationStore())

  const data = ref<Menu>()
  const isRegistered = ref(false)
  const paused = ref(!navigator.onLine)
  const loading = ref(false)
  const error = ref<Error>()

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
    if (!menuRefreshRate.value) return

    requestIdleCallback(async () => {
      try {
        const date = Temporal.Now.plainDateISO().toString()

        let menuData = await menuGet(date)
        if (!menuData) {
          loading.value = true
          menuData = (await pioneerFetchAndCache(date)) as TMenu
        }

        if (menuData) {
          data.value = menuData
        }
      } catch (e) {
        console.error(e)
        error.value = e as Error
      } finally {
        loading.value = false
        timeout = setTimeout(sync, menuRefreshRate.value)
      }
    })
  }

  const unwatch = watchEffect(() => {
    if (menuRefreshRate.value) {
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
    data,
    loading,
    error,
    pause,
    resume,
  }
}
