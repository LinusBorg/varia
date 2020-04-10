import {
  useFocusGroup,
  useRovingTabIndex,
  createTemplateRefFn,
} from '~/composables'
import { Ref } from '@vue/composition-api'

interface IUseRadiogroupOptions {
  integrateWithParentGroup?: boolean
  orientation?: 'vertical' | 'horizontal'
  loop?: boolean
}

const defaults: IUseRadiogroupOptions = {
  integrateWithParentGroup: true,
  orientation: 'horizontal',
  loop: true,
}

export function useRadiogroup(
  selectedIndexRef: Ref<number>,
  options: IUseRadiogroupOptions
) {
  const { integrateWithParentGroup, orientation, loop } = Object.assign(
    {},
    defaults,
    options
  )
  const { elements, fn } = createTemplateRefFn()

  const focusGroup = useFocusGroup(elements, {
    integrateWithParentGroup,
  })

  // if we integrate with the parent, we don't ned to take care of arrow nav ourselves
  let rovingIndex = {}
  if (!integrateWithParentGroup) {
    rovingIndex = useRovingTabIndex(
      elements,
      focusGroup.isActive,
      selectedIndexRef,
      {
        orientation,
        loop,
      }
    )
  }

  // TODO: implement aria-attribute generator

  return {
    fn,
    ...rovingIndex,
  }
}
