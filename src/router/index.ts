import useAuth from '@/composables/useAuth'
import Auth from '@/pages/Auth.vue'
import EditAuth from '@/pages/config/EditAuth.vue'
import EditDevice from '@/pages/config/EditDevice.vue'
import EditMenus from '@/pages/config/EditMenus.vue'
import { default as ConfigIndex } from '@/pages/config/Index.vue'
import Index from '@/pages/Index.vue'
import Kiosk from '@/pages/Kiosk.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/:date(\\d{4}-\\d{2}-\\d{2})?', name: 'home', component: Index, props: true },
    { path: '/kiosk/:date(\\d{4}-\\d{2}-\\d{2})?', name: 'kiosk', component: Kiosk, props: true },
    {
      path: '/config',
      name: 'config',
      component: ConfigIndex,
      redirect: { name: 'edit-menus' },
      children: [
        { path: '/config/menus', name: 'edit-menus', component: EditMenus },
        { path: '/config/device', name: 'edit-device', component: EditDevice },
        { path: '/config/auth', name: 'edit-auth', component: EditAuth },
      ],
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
    },
  ],
})

router.beforeEach((to, from) => {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn.value && to.path.startsWith('/config')) {
    return { name: 'auth' }
  }
})

export { router }
