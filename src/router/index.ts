import EditDevice from '@/pages/config/EditDevice.vue'
import EditMenus from '@/pages/config/EditMenus.vue'
import { default as ConfigIndex } from '@/pages/config/Index.vue'
import Index from '@/pages/Index.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Index },
    {
      path: '/config',
      name: 'config',
      component: ConfigIndex,
      children: [
        { path: '/config/device', name: 'edit-device', component: EditDevice },
        { path: '/config/menus', name: 'edit-menus', component: EditMenus },
      ],
    },
  ],
})

export { router }
