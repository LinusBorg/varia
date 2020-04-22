<template>
  <div :is="tag" v-bind="triggerAttrs">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { injectDisclosureContext } from './use-disclosure'
export default defineComponent({
  name: 'DisclosureTrigger',
  props: {
    tag: {
      type: String,
      default: 'DIV',
    },
  },
  setup() {
    const { triggerAttrs } = injectDisclosureContext()
    return {
      triggerAttrs,
    }
  },
})
</script>

<style scoped></style>
