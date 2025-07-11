import { useConfigurationStore } from '@/stores/configurationStore'
import { storeToRefs } from 'pinia'
import { Temporal } from 'temporal-polyfill'
import { onUnmounted, ref, watchEffect } from 'vue'
import { useOffline } from './useOffline'
import { useWindowEvent } from './useWindowEvent'

export default function useScheduledTimeSync() {
  const { layoutRefreshRate } = storeToRefs(useConfigurationStore())

  const time = ref<Temporal.PlainTime>(Temporal.Now.plainTimeISO())
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
    if (!layoutRefreshRate.value) return

    time.value = Temporal.Now.plainTimeISO()

    let secondsUntilNextRefresh = 1
    while ((time.value.second + secondsUntilNextRefresh) % (layoutRefreshRate.value / 1000) > 0) {
      secondsUntilNextRefresh++
    }

    timeout = setTimeout(sync, secondsUntilNextRefresh * 1000)
  }

  const unwatch = watchEffect(
    () => {
      if (layoutRefreshRate.value) {
        if (isRegistered.value) {
          unwatch()
        } else {
          if (!paused.value) {
            sync()
          }

          isRegistered.value = true
        }
      }
    },
    { flush: 'post' },
  )

  onUnmounted(pause)

  useWindowEvent('blur', pause)
  useWindowEvent('focus', resume)

  return {
    time,
  }
}
