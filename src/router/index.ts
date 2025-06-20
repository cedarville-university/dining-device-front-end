import useAuth from '@/composables/useAuth'
import Auth from '@/pages/Auth.vue'
import EditApi from '@/pages/config/EditApi.vue'
import EditAuth from '@/pages/config/EditAuth.vue'
import EditDevice from '@/pages/config/EditDevice.vue'
import EditMenus from '@/pages/config/EditMenus.vue'
import { default as ConfigIndex } from '@/pages/config/Index.vue'
import Index from '@/pages/Index.vue'
import Kiosk from '@/pages/Kiosk.vue'
import { createRouter, createWebHistory } from 'vue-router'

const appRoot = import.meta.env.VITE_APP_ROOT

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: appRoot + ':date(\\d{4}-\\d{2}-\\d{2})?', name: 'home', component: Index, props: true },
    {
      path: appRoot + 'kiosk/:date(\\d{4}-\\d{2}-\\d{2})?',
      name: 'kiosk',
      component: Kiosk,
      props: true,
    },
    {
      path: appRoot + 'config',
      name: 'config',
      component: ConfigIndex,
      redirect: { name: 'edit-menus' },
      children: [
        { path: appRoot + 'config/menus', name: 'edit-menus', component: EditMenus },
        { path: appRoot + 'config/device', name: 'edit-device', component: EditDevice },
        { path: appRoot + 'config/auth', name: 'edit-auth', component: EditAuth },
        { path: appRoot + 'config/api', name: 'edit-api', component: EditApi },
      ],
    },
    {
      path: appRoot + 'auth',
      name: 'auth',
      component: Auth,
    },
  ],
})

router.beforeEach((to) => {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn.value && to.path.startsWith(appRoot + 'config')) {
    return { name: 'auth' }
  }
})

export { router }
