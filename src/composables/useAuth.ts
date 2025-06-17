import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const isAuth = ref(false)
export default function useAuth() {
  const login = () => (isAuth.value = true)
  const logout = () => (isAuth.value = false)
  const isLoggedIn = computed(() => isAuth.value)

  return {
    isLoggedIn,
    login,
    logout,
  }
}
