<template>
  <div v-if="isActiveTab" v-bind="attributes"></div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { tabAPIKey } from './use-tabs'

export default defineComponent({
  name: 'TabPanel',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const tabState = inject(tabAPIKey)
    if (!tabState) {
      console.warn(
        '<TabPanel />: useTabs() was not called in a parent component'
      )
      throw new Error('Missing TabsAPI Injection from parent component')
    }
    const id = computed(() => tabState.generateId(props.name))
    const isActiveTab = computed(() => tabState.activeTab.value === props.name)
    const attributes = computed(() =>
      tabState.generateTabPanelAttrs(id.value, isActiveTab.value)
    )
    return {
      attributes,
      isActiveTab,
    }
  },
})
</script>

<style scoped></style>
