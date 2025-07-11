import { onMounted, onUnmounted } from 'vue'

export const useWindowEvent = <T extends keyof WindowEventMap>(
  event: T,
  handler: (event: WindowEventMap[T]) => void,
) => {
  onMounted(() => window.addEventListener(event, handler))
  onUnmounted(() => window.removeEventListener(event, handler))
}
