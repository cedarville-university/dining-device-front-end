import { onMounted, onUnmounted, ref } from 'vue'

// default idle timeout of 60 seconds
export default function useIdleTimeout(onIdle: () => void, idleTimeout = 60 * 1000) {
  const isIdle = ref(false)

  const handleIdle = () => {
    isIdle.value = true
    cleanup()
    onIdle()
  }

  let idleTimeoutId = -1
  const resetIdleTimer = () => {
    if (idleTimeoutId > -1) clearTimeout(idleTimeoutId)
    idleTimeoutId = setTimeout(handleIdle, idleTimeout)
  }

  const addEvents = (events: string | string[], cb: (...args: any[]) => any) => {
    if (typeof events === 'string') events = events.split(' ').map((e) => e.trim())

    events.forEach((e) => window.addEventListener(e, cb))
  }

  const removeEvents = (events: string | string[], cb: (...args: any[]) => any) => {
    if (typeof events === 'string') events = events.split(' ').map((e) => e.trim())

    events.forEach((e) => window.removeEventListener(e, cb))
  }

  const setup = () => {
    addEvents(
      [
        'mousemove', // Mouse movement
        'mousedown', // Mouse button pressed down
        'click', // Mouse click
        'keydown', // Keyboard key pressed down
        'scroll', // Scrolling within the document or an element
        'touchstart', // Touchscreen press started
        'touchmove', // Touchscreen touch moving
      ],
      resetIdleTimer,
    )
  }

  const cleanup = () => {
    clearInterval(idleTimeoutId)
    removeEvents(
      [
        'mousemove', // Mouse movement
        'mousedown', // Mouse button pressed down
        'click', // Mouse click
        'keydown', // Keyboard key pressed down
        'scroll', // Scrolling within the document or an element
        'touchstart', // Touchscreen press started
        'touchmove', // Touchscreen touch moving
      ],
      resetIdleTimer,
    )
  }

  onMounted(setup)
  onUnmounted(cleanup)

  return {
    isIdle,
  }
}
