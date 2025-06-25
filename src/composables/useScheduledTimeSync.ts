import { useConfigurationStore } from '@/stores/configurationStore'
import { storeToRefs } from 'pinia'
import { Temporal } from 'temporal-polyfill'
import {
  onUnmounted,
  ref,
  toValue,
  watch,
  watchEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
} from 'vue'

// refresh rate defaults to every 5 minutes
export default function useScheduledTimeSync() {
  const { layoutRefreshRate } = storeToRefs(useConfigurationStore())

  const time = ref<Temporal.PlainTime>(Temporal.Now.plainTimeISO())
  const paused = ref(!navigator.onLine)
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

          window.addEventListener('blur', pause)
          window.addEventListener('focus', resume)

          window.addEventListener('offline', pause)
          window.addEventListener('online', resume)

          isRegistered.value = true
        }
      }
    },
    { flush: 'post' },
  )

  onUnmounted(() => {
    pause()

    window.removeEventListener('blur', pause)
    window.removeEventListener('focus', resume)

    window.removeEventListener('offline', pause)
    window.removeEventListener('online', resume)
  })

  return {
    time,
  }
}
