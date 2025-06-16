import { toRaw, isRef, isReactive, isProxy } from 'vue'

export function deepUnref(source: any): any {
  if (Array.isArray(source)) {
    return source.map((item) => deepUnref(item))
  }

  if (isRef(source) || isReactive(source) || isProxy(source)) {
    return deepUnref(toRaw(source))
  }

  if (source && typeof source === 'object') {
    return Object.keys(source).reduce((acc: any, key) => {
      acc[key] = deepUnref(source[key])
      return acc
    }, {})
  }

  return source
}
