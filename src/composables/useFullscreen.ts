import { onMounted, onUnmounted, ref } from 'vue'

export default function useFullscreen() {
  const isFullscreen = ref(!!document.fullscreenElement)
  const toggleFullscreen = () => (isFullscreen.value = !isFullscreen.value)

  onMounted(() => document.addEventListener('fullscreenchange', toggleFullscreen))
  onUnmounted(() => document.removeEventListener('fullscreenchange', toggleFullscreen))

  const enterFullscreen = () => {
    if (!isFullscreen.value) {
      document.documentElement.requestFullscreen()
    }
  }
  const exitFullscreen = () => {
    if (isFullscreen.value) {
      document.exitFullscreen()
    }
  }

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
  }
}
