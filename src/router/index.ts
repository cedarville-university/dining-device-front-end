import Config from '@/pages/Config.vue'
import Menu from '@/pages/Menu.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: Menu },
    { path: '/config', name: 'config', component: Config },
  ],
})

export { router }
