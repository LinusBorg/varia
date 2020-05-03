<template>
  <div class="wrapper divide-y divide-gray-300">
    <div class="mb-3 mt-6 py-2">
      <h2 class="text-xl font-bold mb-2">Basic</h2>
      <TabList class="border-b border-gray-300">
        <Tab
          name="A"
          class="px-3 py-1 rounded-sm border border-b-0 rounded-b-none inline-block mr-1"
          >Tab A</Tab
        >
        <Tab
          name="B"
          class="px-3 py-1 rounded-sm border border-b-0 rounded-b-none inline-block mr-1"
          >Tab B</Tab
        >
        <Tab
          name="C"
          class="px-3 py-1 rounded-sm border border-b-0 rounded-b-none inline-block mr-1"
          >Tab C</Tab
        >
      </TabList>
      <TabPanel name="A">Panel A</TabPanel>
      <TabPanel name="B">Panel B</TabPanel>
      <TabPanel name="C">Panel C</TabPanel>
    </div>
    <div class="mb-3 mt-6 py-2">
      <h2 class="text-xl font-bold mb-2">Arrow Keys auto-select</h2>
      <TabList class="border-b border-gray-300">
        <Tab
          :tabsKey="tabs2"
          name="A"
          class="px-3 py-1 rounded-sm border border-b-0 rounded-b-none inline-block mr-1"
          >Tab A</Tab
        >
        <Tab
          :tabsKey="tabs2"
          name="B"
          class="px-3 py-1 rounded-sm border border-b-0 rounded-b-none inline-block mr-1"
          >Tab B</Tab
        >
        <Tab
          :tabsKey="tabs2"
          name="C"
          class="px-3 py-1 rounded-sm border border-b-0 rounded-b-none inline-block mr-1"
          >Tab C</Tab
        >
      </TabList>
      <div class="p-2">
        <TabPanel :tabsKey="tabs2" name="A">Panel A</TabPanel>
        <TabPanel :tabsKey="tabs2" name="B">Panel B</TabPanel>
        <TabPanel :tabsKey="tabs2" name="C">Panel C</TabPanel>
      </div>
    </div>
    <div class="mb-3 mt-6 py-2">
      <h2 class="text-xl font-bold mb-2">Disabled Tab</h2>
      <p>This is still buggy</p>
      <TabList class="border-b border-gray-300">
        <Tab
          :tabsKey="tabs3"
          name="A"
          class="px-3 py-1 rounded-sm border border-b-0 rounded-b-none inline-block mr-1"
          >Tab A</Tab
        >
        <Tab
          :tabsKey="tabs3"
          name="B"
          disabled
          class="px-3 py-1 rounded-sm border border-b-0 rounded-b-none inline-block mr-1"
          >Tab B</Tab
        >
        <Tab
          :tabsKey="tabs3"
          name="C"
          class="px-3 py-1 rounded-sm border border-b-0 rounded-b-none inline-block mr-1"
          >Tab C</Tab
        >
      </TabList>
      <TabPanel :tabsKey="tabs3" name="A">Panel A</TabPanel>
      <TabPanel :tabsKey="tabs3" name="B">Panel B</TabPanel>
      <TabPanel :tabsKey="tabs3" name="C">Panel C</TabPanel>
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

    const tabsAPI3 = useTabs({
      customName: 'TabsWithDisabled',
      initialValue: 'C',
    })
    return {
      tabs2: tabsAPI2.tabsKey,
      tabs3: tabsAPI3.tabsKey,
    }
  },
})
</script>

<style scoped lang="postcss">
.wrapper >>> [role='tab'][aria-selected='true'] {
  @apply bg-teal-300;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
