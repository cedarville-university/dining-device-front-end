import { Temporal } from 'temporal-polyfill'
import { onMounted, onUnmounted, ref } from 'vue'

// refresh rate defaults to every 5 minutes
export default function useScheduledTimeSync(refreshRate = 5 * 60 * 1000) {
  const time = ref<Temporal.PlainTime>(Temporal.Now.plainTimeISO())
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
    time.value = Temporal.Now.plainTimeISO()

    let secondsUntilNextRefresh = 1
    while ((time.value.second + secondsUntilNextRefresh) % (refreshRate / 1000) > 0) {
      secondsUntilNextRefresh++
    }

    timeout = setTimeout(sync, secondsUntilNextRefresh * 1000)
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
    time,
  }
}
