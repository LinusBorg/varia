import { provide, inject, InjectionKey, Ref } from 'vue'
import { useIdGenerator } from 'vue-aria-composables'

export interface DisclosureAPI {
  state: Ref<boolean>
  id: string
}
export type DisclosureKey = InjectionKey<DisclosureAPI>

export const disclosureKey = Symbol('disclosure') as DisclosureKey

export function useDisclosure(
  state: Ref<boolean>,
  { skipProvide }: { skipProvide?: boolean } = {}
) {
  const id = useIdGenerator()('disclosure')

  !skipProvide &&
    provide(disclosureKey, {
      state,
      id,
    })

  return {
    state,
    id,
  }
}

export function injectDisclosureAPI() {
  const context = inject(disclosureKey)
  if (!context) {
    throw new Error('Disclosure: useDisclosure() not called in parent')
  }
  return context
}
