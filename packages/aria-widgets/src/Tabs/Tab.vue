<template>
  <div :is="tag" v-bind="attrs">
    <slot />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  ref,
  Ref,
  PropType,
  mergeProps,
} from 'vue'
import { tabElementsKey, tabAPIKey, tabListMarker } from './use-tabs'
import { useParentElementInjection } from 'vue-aria-composables'
import { useClickable, ClickableOptions } from '../Clickable'
export default defineComponent({
  name: 'Tab',
  props: {
    tag: {
      type: [String, Object],
      default: 'DIV',
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(
    props,
    {
      attrs,
    }: {
      attrs: ClickableOptions
    }
  ) {
    if (!inject(tabListMarker)) {
      console.warn('<Tab/> has to be nested inside of a `<TabList />`')
    }
    const tabState = inject(tabAPIKey)
    if (!tabState) {
      console.warn('<Tab />: useTabs() was not called in parent component')
      throw new Error('Missing TabsAPI Injection from parent component')
    }
    const onClick = () => {
      tabState?.select(props.name)
    }
    const isActiveTab = computed(() => tabState.activeTab.value === props.name)

    // A11y
    const id = computed(() => tabState.generateId(props.name))
    const el = ref<HTMLElement>()
    const tabEls = useParentElementInjection(
      tabElementsKey,
      el as Ref<HTMLElement>
    )

    // Element Attributes
    const clickableAttrs = useClickable(attrs)
    const attributes = computed(() =>
      mergeProps(
        clickableAttrs,
        tabState.generateTabAttrs(id.value, isActiveTab.value),
        { onClick }
      )
    )

    return {
      el,
      onClick,
      attributes,
    }
  },
})
</script>

<style scoped></style>
