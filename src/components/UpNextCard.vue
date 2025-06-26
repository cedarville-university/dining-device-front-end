<script setup lang="ts">
import type { Venue } from '@/composables/useMenuData'
import type { TConfigMenu, TVenue, TVenueName } from '@/db'
import { Temporal } from 'temporal-polyfill'
import { computed } from 'vue'
import InfoCard from './InfoCard.vue'

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
    <InfoCard title="Up Next">
      <div>
        <span class="text-gray-600 text-sm">{{ startsAt }} - {{ endsAt }}</span>
        <h4 class="text-2xl font-semibold">{{ menu.venueName?.apiName }}</h4>
      </div>
      <ul>
        <li
          v-for="item in venue.items"
          :key="item.id"
          class="list-disc list-inside pl-4 accent-(--secondary-color)"
        >
          {{ item.name }}
        </li>
      </ul>
    </InfoCard>
  </div>
</template>
