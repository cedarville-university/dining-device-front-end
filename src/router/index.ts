import Config from '@/pages/Config.vue'
import Index from '@/pages/Index.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: Index },
    { path: '/config', name: 'config', component: Config },
  ],
})

export { router }
