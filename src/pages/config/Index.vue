<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <PageHeader title="Device Configuration">
    <AppButton to="/"> Back Home </AppButton>
  </PageHeader>
  <div class="grid grid-cols-4 h-full">
    <aside
      class="col-span-1 bg-white h-(--view-height) overflow-auto overscroll-y-contain p-4 shadow"
    >
      <nav>
        <ul class="flex flex-col gap-2">
          <li class="flex">
            <RouterLink
              to="/config/device"
              class="px-4 py-2 bg-gray-500/15 active:bg-gray-500/35 text-lg w-full rounded"
              active-class="bg-primary text-white active:bg-primary"
            >
              Device Setup
            </RouterLink>
          </li>
          <li class="flex">
            <RouterLink
              to="/config/menus"
              class="px-4 py-2 bg-gray-500/15 active:bg-gray-500/35 text-lg w-full rounded"
              active-class="bg-primary text-white active:bg-primary"
            >
              Menu Setup
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>
    <main
      class="group/content @container/content relative h-(--view-height) col-span-3 p-4 overflow-auto"
    >
      <RouterView />
    </main>
  </div>
</template>
