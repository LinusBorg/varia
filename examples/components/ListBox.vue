<template>
  <div>
    <ul ref="ul" role="listbox">
      <li class="selectable" v-ref-fn="listboxRefFn">
        Selectable List Item #1
      </li>
      <li class="selectable" v-ref-fn="listboxRefFn">
        Selectable List Item #2
      </li>
      <li class="selectable" v-ref-fn="listboxRefFn">
        Selectable List Item #3
      </li>
    </ul>
    <button @click="show = !show">Toggle</button>
    <p v-if="show">Toggle Target</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onUpdated } from 'vue'
import {
  useFocusGroup,
  createTemplateRef,
  useRovingTabIndex,
  createQueryTemplateRef,
  createTemplateRefFn,
  refFn,
} from '../../src'

export default defineComponent({
  name: 'ListBox',
  directives: {
    refFn,
  },
  setup(_, { refs }) {
    const { elements, fn: listboxRefFn } = createTemplateRefFn()
    onUpdated(() => console.log(elements.value))

    const focusGroup = useFocusGroup(elements, {
      includeChildComponents: true,
    })
    useRovingTabIndex(elements, focusGroup.isActive)

    return {
      listboxRefFn,
      show: ref(false),
    }
  },
})
</script>

<style scoped></style>
