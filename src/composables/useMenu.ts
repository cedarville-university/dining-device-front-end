import { get as localGet, store } from '@/functions/localMenu'
import { get as pioneerFetch } from '@/functions/pioneerMenu'
import { transformPioneerMenuToMenu } from '@/functions/transformers'
import { Temporal } from 'temporal-polyfill'
import { ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

export interface Menu {
  id?: number
  date: string
  venues: Venue[]
}

export interface Venue {
  id?: number
  name: string
  items: MenuItem[]
}

export interface MenuItem {
  id?: number
  name: string
  allergens: string[]
}

export default function useMenu(
  startDate: MaybeRefOrGetter<Temporal.PlainDate> = Temporal.Now.plainDateISO(),
) {
  const data = ref<Menu>()
  const loading = ref(false)
  const error = ref()

  watchEffect(async () => {
    try {
      const date = toValue(startDate).toString()
      data.value = await localGet(date)
      if (!data.value) {
        loading.value = true
        const pioneerData = await pioneerFetch(date)
        if (pioneerData) {
          data.value = await store(transformPioneerMenuToMenu(pioneerData))
        }
      }
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  })

  return {
    menu: data,
    loading,
    error,
  }
}
