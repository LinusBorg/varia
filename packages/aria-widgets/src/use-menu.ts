import {
  createTemplateRefList,
  useFocusGroup,
  useRovingTabIndex,
  useReturnBehaviour,
} from 'vue-aria-composables'
import { onMounted } from 'vue'

interface useMenuOptions {
  loop?: boolean
  focusOnMount?: boolean
  orientation?: 'horizontal' | 'vertical'
  returnOnEscape?: boolean
  returnOnUnmount?: boolean
}

export function useMenu(
  options: useMenuOptions = {
    orientation: 'vertical',
  }
) {
  const {
    focusOnMount,
    returnOnUnmount,
    returnOnEscape,
    orientation,
    // loop,
  } = options

  const { elements, refFn } = createTemplateRefList()

  const focusGroup = useFocusGroup(elements)

  const { returnFocus } = useReturnBehaviour(focusGroup.hasFocus, {
    returnOnEscape,
    returnOnUnmount,
  })

  const rovingTabIndex = useRovingTabIndex(elements, focusGroup.hasFocus, {
    orientation,
  })
  focusOnMount &&
    onMounted(() => {
      focusGroup.setFocusToIndex(0)
    })

  return {
    refFn,
    ...rovingTabIndex,
    isActive: focusGroup.hasFocus,
    returnFocus,
  }
}
