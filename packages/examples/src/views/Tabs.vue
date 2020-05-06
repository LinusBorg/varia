<template>
  <div class="wrapper divide-y divide-gray-300">
    <div class="mb-3 mt-6 py-2">
      <h2 class="text-xl font-bold mb-2">Basic</h2>
      <TabList class="border-b border-gray-500">
        <Tab
          name="A"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab A</Tab
        >
        <Tab
          name="B"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab B</Tab
        >
        <Tab
          name="C"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab C</Tab
        >
      </TabList>
      {{ tabs1.id }}
      <TabPanel name="A">Panel A</TabPanel>
      <TabPanel name="B">Panel B</TabPanel>
      <TabPanel name="C">Panel C</TabPanel>
    </div>
    <div class="mb-3 mt-6 py-2" ref="tab2.ref" v-bind="tabs2.attributes">
      <h2 class="text-xl font-bold mb-2">Arrow Keys auto-select</h2>
      <TabList class="border-b border-gray-500" :tabsKey="tabs2.tabsKey">
        <Tab
          :tabsKey="tabs2.tabsKey"
          name="A"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab A</Tab
        >
        <Tab
          :tabsKey="tabs2.tabsKey"
          name="B"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab B</Tab
        >
        <Tab
          :tabsKey="tabs2.tabsKey"
          name="C"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab C</Tab
        >
      </TabList>
      <div class="p-2">
        <TabPanel :tabsKey="tabs2.tabsKey" name="A">Panel A</TabPanel>
        <TabPanel :tabsKey="tabs2.tabsKey" name="B">Panel B</TabPanel>
        <TabPanel :tabsKey="tabs2.tabsKey" name="C">Panel C</TabPanel>
      </div>
    </div>
    <div class="mb-3 mt-6 py-2" ref="tab3.ref" v-bind="tabs3.attributes">
      <h2 class="text-xl font-bold mb-2">Disabled Tab</h2>
      <TabList class="border-b border-gray-500">
        <Tab
          :tabsKey="tabs3.tabsKey"
          name="A"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab A</Tab
        >
        <Tab
          :tabsKey="tabs3.tabsKey"
          name="B"
          disabled
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab B</Tab
        >
        <Tab
          :tabsKey="tabs3.tabsKey"
          name="C"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab C</Tab
        >
      </TabList>
      <TabPanel :tabsKey="tabs3.tabsKey" name="A">Panel A</TabPanel>
      <TabPanel :tabsKey="tabs3.tabsKey" name="B">Panel B</TabPanel>
      <TabPanel :tabsKey="tabs3.tabsKey" name="C">Panel C</TabPanel>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Tab, TabList, TabPanel, useTabs } from 'vue-aria-widgets'

export default defineComponent({
  components: {
    Tab,
    TabList,
    TabPanel,
  },
  setup() {
    const tabsAPI1 = useTabs({
      initialValue: 'A',
      loop: true,
    })

    // Auto-Select
    const tabsAPI2 = useTabs({
      initialValue: 'B',
      autoSelect: true,
      startOnFirstSelected: true,
      customName: 'TabsWithAutoSelect',
    })

    const tabsAPI3 = useTabs({
      customName: 'TabsWithDisabled',
      initialValue: 'C',
    })
    return {
      tabs1: tabsAPI1,
      tabs2: tabsAPI2,
      tabs3: tabsAPI3,
    }
  },
})
</script>

<style scoped lang="postcss">
.wrapper >>> [role='tab'][aria-selected='true'] {
  @apply bg-teal-500 border-teal-600 text-white;
}
.wrapper >>> [role='tab'][aria-disabled='true'] {
  @apply bg-gray-200 text-gray-600;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
