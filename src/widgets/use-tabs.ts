import Vue from 'vue'
import { Ref, computed, watch } from '@vue/composition-api'
import { createTemplateRefFn } from '../composables/template-ref-helpers'
import { useFocusGroup, useRovingTabIndex } from '~/composables'
import { useIdGenerator } from '../composables/use-id-generator'
import { MaybeRef } from '~/types'
import { wrap } from '~/utils'

export interface useTabsOptions {
  vertical?: boolean
  autoSelect?: boolean
}
export function useTabs(
  selectedName: Ref<string>,
  options: useTabsOptions = {}
) {
  const { autoSelect } = options

  const { elements, fn: tabsRefFn } = createTemplateRefFn()
  const focusGroup = useFocusGroup(elements)

  const selectedIndex = computed(() => {
    const idx = elements.value.findIndex(
      el => el.dataset['tabName'] === '' + selectedName.value
    )
    return idx !== -1 ? idx : 0
  })
  const rovingTabIndex = useRovingTabIndex(
    elements,
    focusGroup.isActive,
    selectedIndex,
    {
      orientation: 'horizontal',
      loop: true,
    }
  )

  if (autoSelect) {
    watch(rovingTabIndex.index, idx => {
      elements.value[idx] && elements.value[idx].click()
    })
  }

  // Attribute generator functions
  const idGen = useIdGenerator('tabs')
  const tab = (name: string) => {
    const id = idGen(name)
    return {
      role: 'tab',
      'aria-selected': name === selectedName.value,
      'aria-controls': id,
      'data-tab-name': name,
    }
  }
  const tabPanel = (name: string) => {
    const id = idGen(name)
    return {
      role: 'tabpanel',
      id,
      hidden: name !== selectedName.value,
      tabindex: name == selectedName.value ? 0 : undefined,
    }
  }

  return {
    fn: tabsRefFn,
    ...rovingTabIndex,
    isActive: focusGroup.isActive,
    tab,
    tabPanel,
  }
}
