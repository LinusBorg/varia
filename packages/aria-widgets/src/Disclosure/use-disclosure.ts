import { defineComponent, provide, Ref, PropType } from 'vue'
import { createId, wrapProp } from 'vue-aria-composables'

import { DisclosureAPIKey, DisclosureOptions } from '../types'
import { createInjector } from '../utils/inject'

export const disclosureAPIKey = Symbol('disclosure') as DisclosureAPIKey

export function useDisclosure(
  selected: Ref<boolean | undefined>,
  { skipProvide, customKey }: DisclosureOptions = {}
) {
  const id = createId()
  const api = {
    state: {
      selected,
      toggle: () => (selected.value = !selected.value),
    },
    options: {
      id,
    },
  }
  const key = customKey ?? disclosureAPIKey
  !skipProvide && provide(key, api)

  return api
}

export const injectDisclosureAPI = createInjector(
  disclosureAPIKey,
  `injectDisclosureAPI()`
)

export const disclosureProps = {
  modelValue: Boolean as PropType<boolean>,
}

export const Dicsclosure = defineComponent({
  name: 'Disclosure',
  props: disclosureProps,
  setup(props, { slots }) {
    const state = wrapProp(props, 'modelValue')
    useDisclosure(state)
    return () => slots.default?.()
  },
})
