import useAuth from '@/composables/useAuth'
import Auth from '@/pages/Auth.vue'
import AddDevice from '@/pages/config/AddDevice.vue'
import EditApi from '@/pages/config/EditApi.vue'
import EditAuth from '@/pages/config/EditAuth.vue'
import EditDevice from '@/pages/config/EditDevice.vue'
import EditDeviceDetails from '@/pages/config/EditDeviceDetails.vue'
import EditMenus from '@/pages/config/EditMenus.vue'
import { default as ConfigIndex } from '@/pages/config/Index.vue'
import ResetDb from '@/pages/config/ResetDb.vue'
import Index from '@/pages/Index.vue'
import Kiosk from '@/pages/Kiosk.vue'
import { createRouter, createWebHistory } from 'vue-router'

const appRoot = import.meta.env.VITE_APP_ROOT

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: appRoot + ':date(\\d{4}-\\d{2}-\\d{2})?', name: 'home', component: Index, props: true },
    {
      path: appRoot + 'kiosk',
      name: 'kiosk',
      component: Kiosk,
    },
    {
      path: appRoot + 'config',
      name: 'config',
      component: ConfigIndex,
      redirect: { name: 'edit-menus' },
      children: [
        { path: appRoot + 'config/menus', name: 'edit-menus', component: EditMenus },
        {
          path: appRoot + 'config/device',
          name: 'edit-device',
          component: EditDevice,
        },
        { path: appRoot + 'config/divice/add', name: 'add-device', component: AddDevice },
        {
          path: appRoot + 'config/device/:deviceId',
          name: 'edit-device-details',
          component: EditDeviceDetails,
          props: true,
        },
        { path: appRoot + 'config/auth', name: 'edit-auth', component: EditAuth },
        { path: appRoot + 'config/api', name: 'edit-api', component: EditApi },
        { path: appRoot + 'config/reset', name: 'reset-db', component: ResetDb },
      ],
    },
    {
      path: appRoot + 'auth',
      name: 'auth',
      component: Auth,
    },
  ],
})

router.beforeEach((to, from) => {
  const { isLoggedIn, logout } = useAuth()

  // entering config
  if (!isLoggedIn.value && to.path.startsWith(appRoot + 'config')) {
    return { name: 'auth' }
  }

  // leaving config
  if (isLoggedIn.value && !to.path.startsWith(appRoot + 'config')) {
    logout()
  }
})

export { router }
