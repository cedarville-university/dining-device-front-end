import Config from '@/pages/Config.vue'
import Menu from '@/pages/Menu.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: Menu },
  { path: '/config', Component: Config },
]

const router = createRouter({
  history: createMemoryHistory(),
  // @ts-ignore
  routes,
})

export { router }
