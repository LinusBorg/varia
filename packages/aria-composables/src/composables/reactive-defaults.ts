import { watch, reactive, toRefs } from 'vue'
export function useReactiveDefaults<T extends object>(
  obj: Partial<T>,
  defaults: T
) {
  const o = reactive({}) as T
  watch(obj, () => Object.assign(o, defaults, obj), { immediate: true })
  return toRefs(o)
}
