import Vue from 'vue'
import {
  computed,
  onBeforeUnmount,
  provide,
  InjectionKey,
  inject,
  getCurrentInstance,
  onMounted,
} from '@vue/composition-api'
import { useGlobalFocusTracker } from './use-global-focustracker'
import { useReturnBehaviour } from './use-return-behaviour'
import { applyFocus } from '../utils'
import {
  TemplateRefs,
  FocusableElements,
  ComponentInstance,
  useFocusGroupOptions,
} from '../types'

export const GroupInterfaceKey: InjectionKey<any> = Symbol('GroupInterface')

export function useFocusGroup(
  _elements: TemplateRefs,
  options: useFocusGroupOptions = {}
) {
  const { integrateWithParentGroup, includeChildComponents } = options

  const { currentEl: currentElGlobal } = useGlobalFocusTracker()

  // complete template Refs with those possibly provided by children
  const nestedGroups = includeChildComponents && useNestedGroupInterface()

  const elements = computed(() =>
    !nestedGroups
      ? _elements.value
      : _elements.value.flatMap(item => {
          const id = (item as any)._uid as string
          if (id && nestedGroups[id]) {
            return nestedGroups[id]
          }
          return item as HTMLElement
        })
  )

  // if we ourselves are supposed to integrate with a parent, do it
  if (integrateWithParentGroup) {
    integrateWithParent(elements as TemplateRefs) // TODO: fix type
  }
  const currentTabindex = computed(
    () => currentElGlobal.value && elements.value.indexOf(currentElGlobal.value)
  )
  const containsFocus = computed(() => currentTabindex.value !== -1)
  const currentEl = computed(() =>
    containsFocus.value ? currentElGlobal.value : null
  )

  function setFocusToIndex(index: number) {
    const el = elements.value[index]
    return el && applyFocus(el) // TODO
  }

  return {
    // state
    isActive: containsFocus,
    currentEl,
    currentTabindex,
    // Fns
    setFocusToIndex,
    // other
    ...useReturnBehaviour(containsFocus, options),
  }
}

type NestedGroups = Record<string, FocusableElements>
function useNestedGroupInterface() {
  console.log('provide')
  const nestedGroups: NestedGroups = {}
  provide(GroupInterfaceKey, {
    add: (vm: ComponentInstance, elements: FocusableElements) =>
      Vue.set(nestedGroups, (vm as any)._uid, elements),
    remove: (vm: ComponentInstance) =>
      Vue.delete(nestedGroups, (vm as any)._uid),
  })

  return nestedGroups
}

function integrateWithParent(elements: Readonly<TemplateRefs>) {
  const parentGroupInterface = inject(GroupInterfaceKey)
  if (!parentGroupInterface) return
  const vm = getCurrentInstance()
  onMounted(() => {
    vm && parentGroupInterface.add(vm, elements)
  })
  onBeforeUnmount(() => parentGroupInterface.remove(vm))
}
