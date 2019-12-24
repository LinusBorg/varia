import { SetupContext, Ref, computed, watch } from '@vue/composition-api'
import { createTemplateRef } from '../composables/template-ref-helpers'
import { useFocusGroup, useRovingTabIndex } from '~/composables'
import { useIdGenerator } from '../composables/use-id-generator'

interface useTabsOptions {
  vertical?: boolean
  autoSelect?: boolean
}
export function useTabs(
  ctx: SetupContext,
  names: string[],
  selectedName: Ref<string>,
  options: useTabsOptions = {}
) {
  const { autoSelect } = options

  const elements = createTemplateRef(ctx.refs, names)
  const focusGroup = useFocusGroup(elements)

  const idGen = useIdGenerator()

  const selectedIndex = computed(() => {
    const idx = names.findIndex(name => name === selectedName.value)
    return idx !== -1 ? idx : 0
  })
  const rovingTabIndex = useRovingTabIndex(
    elements,
    focusGroup.isActive,
    selectedIndex,
    'horizontal',
    true
  )

  if (autoSelect) {
    watch(rovingTabIndex.index, idx => {
      elements.value[idx] && elements.value[idx].click()
    })
  }

  type TAttributes = {
    tabs: {
      [key: string]: Record<string, any>
    }
    tabPanels: {
      [key: string]: Record<string, any>
    }
  }
  const attributes = computed(() => {
    return names.reduce<TAttributes>(
      (obj, name) => {
        const id = idGen(name)
        obj.tabs[name] = {
          role: 'tab',
          ariaSelected: name === selectedName.value,
          ariaControls: id,
        }
        obj.tabPanels[name] = {
          role: 'tabPanel',
          id,
          hidden: name !== selectedName.value,
        }
        return obj
      },
      { tabs: {}, tabPanels: {} }
    )
  })

  return {
    ...rovingTabIndex,
    isActive: focusGroup.isActive,
    attributes,
  }
}
