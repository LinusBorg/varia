<template>
  <div v-if="show" :is="tag" v-bind="contentAttrs"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    const { contentAttrs, show } = injectDisclosureContext()
    return {
      contentAttrs,
      show,
    }
  },
})
</script>

<style scoped></style>
