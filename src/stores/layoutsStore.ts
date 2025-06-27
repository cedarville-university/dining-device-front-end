import { db, type TLayoutComponent } from '@/db'
import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

export const useLayoutsStore = defineStore('layouts', () => {
  const layouts = ref<TLayoutComponent[]>()
  onMounted(async () => (layouts.value = await db.layouts.toArray()))

  return {
    layouts,
  }
})
