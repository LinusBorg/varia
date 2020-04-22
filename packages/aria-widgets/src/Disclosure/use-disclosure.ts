import {
  computed,
  provide,
  inject,
  InjectionKey,
  ComputedRef,
  Ref,
  ref,
} from 'vue'
import { useIdGenerator } from 'vue-aria-composables'

interface DisclosureContext {
  show: Ref<boolean>
  triggerAttrs: ComputedRef<{
    'aria-expanded': boolean
    role: 'button'
    'aria-controls': string
  }>
  contentAttrs: ComputedRef<{
    id: string
  }>
}
export type DisclosureKey = InjectionKey<DisclosureContext>

export const disclosureKey = Symbol('disclosure') as DisclosureKey

export function useDisclosure(initialValue: boolean = false) {
  const id = useIdGenerator()('disclosure')
  const show = ref<boolean>(initialValue)
  const triggerAttrs = computed(() => ({
    'aria-expanded': show.value,
    role: 'button' as const,
    'aria-controls': id,
  }))
  const contentAttrs = computed(() => ({
    id,
  }))
  provide(disclosureKey, {
    show,
    triggerAttrs,
    contentAttrs,
  })

  return {
    show,
    triggerAttrs,
    contentAttrs,
  }
}

export function injectDisclosureContext() {
  const context = inject(disclosureKey)
  if (!context) {
    throw new Error('Disclosure: useDisclosure() not called in parent')
  }
  return context
}
