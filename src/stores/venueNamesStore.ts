import { db, type TVenueName } from '@/db'
import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

export const useVenueNamesStore = defineStore('venue-names', () => {
  const venueNames = ref<TVenueName[]>()
  onMounted(async () => (venueNames.value = await db.venues.toArray()))

  return {
    venueNames,
  }
})
