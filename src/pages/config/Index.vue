<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import NavLink from '@/components/NavLink.vue'
import PageHeader from '@/components/PageHeader.vue'
import useAuth from '@/composables/useAuth'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/20/solid'

const { logout } = useAuth()
</script>

<template>
  <PageHeader title="Device Configuration">
    <AppButton
      :to="{ name: 'home' }"
      variant="secondary"
      class="flex gap-1 items-center"
      @click="logout"
    >
      <ArrowLeftStartOnRectangleIcon class="size-5" />
      Exit Configuration
    </AppButton>
  </PageHeader>
  <div class="grid grid-cols-4 h-(--view-height)">
    <aside class="col-span-1 bg-white h-full overflow-auto overscroll-y-contain p-4 shadow">
      <nav>
        <ul class="flex flex-col gap-2">
          <li class="flex">
            <NavLink :to="{ name: 'edit-menus' }"> Menu Setup </NavLink>
          </li>
          <li class="flex">
            <NavLink :to="{ name: 'edit-device' }"> Device Setup </NavLink>
          </li>
          <li class="flex">
            <NavLink :to="{ name: 'edit-auth' }"> Auth Setup </NavLink>
          </li>
          <li class="flex">
            <NavLink :to="{ name: 'edit-api' }"> API Setup </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="group/content @container/content relative h-full col-span-3 p-4 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>
