import {
  createTemplateListRef,
  createTemplateRef,
  useFocusGroup,
  useRovingTabIndex,
} from '~/composables'
import { SetupContext, onMounted } from '@vue/composition-api'

interface useMenuOptions {
  loop?: boolean
  focusOnMount?: boolean
  orientation?: 'horizontal' | 'vertical'
  integrateWithParentGroup?: boolean
  returnOnEscape?: boolean
  returnOnUnmount?: boolean
}

export function useMenu(
  ctx: SetupContext, // refactor for Vue: not needed
  refName: string | string[], // refactor for Vue: not needed
  options: useMenuOptions = {
    orientation: 'vertical',
  }
) {
  const {
    focusOnMount,
    orientation,
    loop,
    integrateWithParentGroup,
    returnOnEscape,
    returnOnUnmount,
  } = options

  // for Vue 3, we have to return a ref-function as well as elements
  const elements = Array.isArray(refName)
    ? createTemplateRef(ctx.refs, refName)
    : createTemplateListRef(ctx.refs, refName)

  const focusGroup = useFocusGroup(elements, {
    includeChildComponents: true,
    integrateWithParentGroup,
    returnOnEscape,
    returnOnUnmount,
  })

  focusOnMount &&
    onMounted(() => {
      focusGroup.setFocusToIndex(0)
    })
  const rovingTabIndex = useRovingTabIndex(
    elements,
    focusGroup.isActive,
    undefined,
    {
      orientation,
      loop,
    }
  )

  return {
    elements,
    ...rovingTabIndex,
    isActive: focusGroup.isActive,
  }
}
