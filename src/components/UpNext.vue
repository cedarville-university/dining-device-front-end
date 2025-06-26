<script setup lang="ts">
import type { Venue } from '@/composables/useMenuData'
import type { TConfigMenu, TVenue, TVenueName } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { computed } from 'vue'

interface Props {
  menu: TConfigMenu & { venueName: TVenueName }
  venue: Venue
}

const { menu } = defineProps<Props>()

const startsAt = computed(() =>
  Temporal.PlainTime.from(menu.startTime).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }),
)
const endsAt = computed(() =>
  Temporal.PlainTime.from(menu.endTime).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    hourCycle: 'h12',
  }),
)
</script>

<template>
  <div class="p-8 grid place-content-center w-full h-full">
    <div
      class="bg-white overflow-clip rounded-lg shadow space-y-4 grid grid-cols-[min-content_1fr] w-full"
    >
      <h3
        class="col-start-1 bg-(--primary-color) text-white text-[64px] font-extrabold uppercase text-shadow-xs px-8 py-2 [writing-mode:sideways-lr]"
      >
        Up Next
      </h3>
      <div class="p-8 space-y-4 grid place-content-center">
        <span>{{ startsAt }} - {{ endsAt }}</span>
        <h4 class="text-2xl font-semibold">{{ menu.venueName?.apiName }}</h4>
        <ul>
          <li
            v-for="item in venue.items"
            :key="item.id"
            class="list-disc list-inside pl-4 accent-(--secondary-color)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
