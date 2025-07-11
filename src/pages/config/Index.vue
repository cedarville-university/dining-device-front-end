<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import NavLink from '@/components/NavLink.vue'
import PageHeader from '@/components/PageHeader.vue'
import useIdleTimeout from '@/composables/useIdleTimeout'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/20/solid'
import { useRouter } from 'vue-router'

const router = useRouter()
// enter the kiosk after an idle period of 1 minute
useIdleTimeout(() => router.replace({ name: 'kiosk' }), 60000)
</script>

<template>
  <PageHeader title="Device Configuration">
    <AppButton :to="{ name: 'home' }" variant="secondary" class="flex gap-1 items-center">
      <ArrowLeftStartOnRectangleIcon class="size-5" />
      Exit Configuration
    </AppButton>
  </PageHeader>

  <div class="flex h-(--view-height)">
    <aside
      class="col-span-1 w-(--config-sidebar-width) bg-white h-full overflow-auto overscroll-y-contain p-4 shadow"
    >
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
    <main
      class="group/content @container/content relative h-full w-(--config-content-width) p-4 overflow-auto"
    >
      <RouterView />
    </main>
  </div>
</template>
