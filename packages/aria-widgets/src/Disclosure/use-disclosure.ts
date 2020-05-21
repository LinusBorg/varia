import { defineComponent, provide, Ref, PropType } from 'vue'
import { createId, wrapProp } from '@varia/composables'

import { DisclosureAPIKey, DisclosureOptions } from '../types'
import { createInjector } from '../utils/inject'

export const disclosureAPIKey = Symbol('disclosure') as DisclosureAPIKey

function _useDisclosure(
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
  // const key = customKey ?? disclosureAPIKey
  // !skipProvide && provide(key, api)

  return api
}

export const useDisclosure = Object.assign(_useDisclosure, {
  withProvide(selected: Ref<boolean | undefined>) {
    const api = _useDisclosure(selected)
    provide(disclosureAPIKey, api)
    return api
  },
})

export const injectDisclosureAPI = createInjector(
  disclosureAPIKey,
  `injectDisclosureAPI()`
)

export const disclosureProps = {
  modelValue: Boolean as PropType<boolean>,
}

export const Disclosure = defineComponent({
  name: 'Disclosure',
  props: disclosureProps,
  emits: ['update:modelValue'],
  setup(props, { slots }) {
    const state = wrapProp(props, 'modelValue')
    useDisclosure.withProvide(state)
    return () => slots.default?.()
  },
})
