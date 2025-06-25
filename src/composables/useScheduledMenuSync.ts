import type { TMenu } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { onMounted, onUnmounted, ref } from 'vue'
import type { Menu } from './useMenu'
import { fetchAndCache as pioneerFetchAndCache } from '@/functions/pioneerMenu'
import { get as menuGet } from '@/models/menus'

export default function useScheduledMenuSync(refreshRate = 1 * 60 * 60 * 1000) {
  const data = ref<Menu>()
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
        timeout = setTimeout(sync, refreshRate)
      }
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
    data,
    loading,
    error,
    pause,
    resume,
  }
}
