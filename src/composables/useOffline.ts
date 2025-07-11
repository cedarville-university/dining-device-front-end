import { computed, ref } from 'vue'
import { useWindowEvent } from './useWindowEvent'

export const useOffline = (onOffline?: () => void, onOnline?: () => void) => {
  const isOffline = ref(!navigator.onLine)
  const isOnline = computed(() => !isOffline.value)

  useWindowEvent('offline', () => {
    isOffline.value = true
    onOffline?.()
  })

  useWindowEvent('online', () => {
    isOffline.value = false
    onOnline?.()
  })

  return {
    isOffline,
    isOnline,
  }
}
