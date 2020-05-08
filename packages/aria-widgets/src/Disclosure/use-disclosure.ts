import { provide, inject, Ref } from 'vue'
import { useIdGenerator } from 'vue-aria-composables'

import { DisclosureAPIKey } from '../types'

export const disclosureAPIKey = Symbol('disclosure') as DisclosureAPIKey

export function useDisclosure(
  selected: Ref<boolean>,
  { skipProvide }: { skipProvide?: boolean } = {}
) {
  const id = useIdGenerator()('disclosure')
  const api = {
    state: {
      selected,
      toggle: () => (selected.value = !selected.value),
    },
    options: {
      id,
    },
  }
  !skipProvide && provide(disclosureAPIKey, api)

  return api
}

export function injectDisclosureAPI(key: DisclosureAPIKey = disclosureAPIKey) {
  const context = inject(key)
  if (!context) {
    throw new Error('Disclosure: useDisclosure() not called in parent')
  }
  return context
}
