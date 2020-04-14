import {
  useFocusGroup,
  useRovingTabIndex,
  createTemplateRefList,
} from 'vue-aria-composables'

interface IUseRadiogroupOptions {
  integrateWithParentGroup?: boolean
  orientation?: 'vertical' | 'horizontal'
  loop?: boolean
}

export function useRadiogroup({ orientation }: IUseRadiogroupOptions) {
  const { elements, refFn } = createTemplateRefList()

  const focusGroup = useFocusGroup(elements)

  const rovingTabIndex = useRovingTabIndex(elements, focusGroup.hasFocus, {
    orientation,
  })
  const genAttrs = (checked: boolean, label: string = '') => {
    const labelProperty = label.startsWith('#')
      ? 'aria-labelledby'
      : 'aria-label'
    return {
      role: 'radio',
      'aria-checked': checked,
      [labelProperty]: label,
    }
  }

  return {
    refFn,
    genAttrs,
    ...rovingTabIndex,
  }
}
