<template>
  <div role="tablist">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import { tabListMarker } from './use-tabs'
export default defineComponent({
  name: 'TabList',
  setup() {
    provide(tabListMarker, true)
  },
})
</script>

<style scoped></style>
