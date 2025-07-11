import { Temporal } from 'temporal-polyfill'
import { onUnmounted, ref, watch, watchEffect } from 'vue'
import type { Menu } from './useMenuData'
import { storeToRefs } from 'pinia'
import { useConfigurationStore } from '@/stores/configurationStore'
import { useOffline } from './useOffline'
import { useWindowEvent } from './useWindowEvent'
import useMenuData from './useMenuData'

export default function useScheduledMenuSync() {
  const { menuRefreshRate } = storeToRefs(useConfigurationStore())
  const { fetchMenu, loading, error } = useMenuData()

  const data = ref<Menu>()
  const isRegistered = ref(false)

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

  const { isOffline } = useOffline(pause, resume)
  const paused = ref(isOffline.value)

  const sync = () => {
    if (!menuRefreshRate.value) return

    requestIdleCallback(async () => {
      try {
        const date = Temporal.Now.plainDateISO().toString()

        const menuData = await fetchMenu(date, true)

        if (menuData) {
          data.value = menuData
        }
      } finally {
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

        isRegistered.value = true
      }
    }
  })

  onUnmounted(pause)

  useWindowEvent('blur', pause)
  useWindowEvent('focus', resume)

  return {
    data,
    loading,
    error,
    pause,
    resume,
  }
}
