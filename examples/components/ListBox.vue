<template>
  <div>
    <ul ref="ul" role="listbox">
      <li class="selectable" ref="el1">Selectable List Item #1</li>
      <li class="selectable" ref="el2">Selectable List Item #2</li>
      <li class="selectable" ref="el3">Selectable List Item #3</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import {
  useFocusGroup,
  createTemplateRef,
  useRovingTabIndex,
  createQueryTemplateRef,
} from '../../src'

export default createComponent({
  name: 'ListBox',
  setup(_, { refs }) {
    // const els = createTemplateRef(refs, ['el1', 'el2', 'el3'])
    const els = createQueryTemplateRef(
      computed<HTMLElement>(() => refs.ul as HTMLElement),
      'li.selectable'
    )
    const focusGroup = useFocusGroup(els, {
      includeChildComponents: true,
    })
    useRovingTabIndex(els, focusGroup.isActive)
    // return { els }
  },
})
</script>

<style scoped></style>
