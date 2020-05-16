import { defineComponent, provide, Ref, PropType } from 'vue'

import { ComponentOptions, ComponentAPIKey } from '../types'
import { wrapProp } from '@varia/composables'
import { createInjector } from '../src/utils/inject'

export const componentAPIKey = Symbol('componentAPI') as ComponentAPIKey
export function useComponent(
  selected: Ref<boolean | undefined>,
  options: ComponentOptions = {}
) {
  const api = {}
  provide(componentAPIKey, api)

  return api
}

export const componentProps = {
  modelValue: Boolean as PropType<boolean>,
}

export const injectComponentAPI = createInjector(
  componentAPIKey,
  'injectComponentAPI'
)

export const Component = defineComponent({
  name: 'Component',
  props: componentProps,
  setup(props, { slots }) {
    const state = wrapProp(props, 'modelValue')
    useComponent(state, props)
    return () => slots.default?.()
  },
})
