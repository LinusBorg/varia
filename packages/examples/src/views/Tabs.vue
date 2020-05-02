<template>
  <div class="divide-y divide-gray-300">
    <div class="mb-3 mt-6 py-2">
      <h2 class="text-xl font-bold mb-2">Basic</h2>
      <TabList class="border-b border-gray-300">
        <Tab name="A">Tab A</Tab>
        <Tab name="B">Tab B</Tab>
        <Tab name="C">Tab C</Tab>
      </TabList>
      <TabPanel name="A">Panel A</TabPanel>
      <TabPanel name="B">Panel B</TabPanel>
      <TabPanel name="C">Panel C</TabPanel>
    </div>
    <div class="mb-3 mt-6 py-2">
      <h2 class="text-xl font-bold mb-2">Arrow Keys auto-select</h2>
      <TabList class="border-b border-gray-300">
        <Tab :tabsKey="tabs2" name="A">Tab A</Tab>
        <Tab :tabsKey="tabs2" name="B">Tab B</Tab>
        <Tab :tabsKey="tabs2" name="C">Tab C</Tab>
      </TabList>
      <TabPanel :tabsKey="tabs2" name="A">Panel A</TabPanel>
      <TabPanel :tabsKey="tabs2" name="B">Panel B</TabPanel>
      <TabPanel :tabsKey="tabs2" name="C">Panel C</TabPanel>
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
    useTabs({
      initialValue: 'A',
    })

    // Auto-Select
    const tabsAPI2 = useTabs({
      initialValue: 'B',
      autoSelect: true,
      customName: 'TabsWithAutoSelect',
    })
    return {
      tabs2: tabsAPI2.tabsKey,
    }
  },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
