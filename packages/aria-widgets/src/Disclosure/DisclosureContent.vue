<template>
  <div v-if="show" :is="tag" v-bind="attributes"></div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import { injectDisclosureContext } from './use-disclosure'
export default defineComponent({
  name: 'Disclosure',
  props: {
    tag: {
      type: String,
      default: 'DIV',
    },
  },
  setup() {
    const { contentAttrs: attributes, show } = injectDisclosureContext()
    return {
      attributes,
      show,
    }
  },
})
</script>

<style scoped></style>
