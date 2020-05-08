import { computed, getCurrentInstance } from 'vue'

export function wrapProp<T extends object, K extends keyof T>(
  props: T,
  name: K
) {
  const vm = getCurrentInstance()
  if (!vm) {
    throw new Error('wrapVModel has to be called in setup')
  }
  const state = computed({
    get: () => props[name],
    set: (v: T[K]) => vm.emit('update:' + name, v),
  })
  return state
}
