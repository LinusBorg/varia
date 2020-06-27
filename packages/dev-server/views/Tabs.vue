<template>
  <div class="wrapper divide-y divide-gray-300">
    <h1 class="text-3xl mb-4">Tabs</h1>
    <Tabs class="mb-3 py-2" v-model="state1" loop virtual>
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
      <TabPanel name="A">Panel A</TabPanel>
      <TabPanel name="B">Panel B</TabPanel>
      <TabPanel name="C">Panel C</TabPanel>
    </Tabs>
    <Tabs class="mb-3 py-2" v-model="state2" autoSelect startOnFirstSelected>
      <h2 class="text-xl font-bold mb-4">Arrow Keys auto-select</h2>
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
      <div class="p-2">
        <TabPanel name="A">Panel A</TabPanel>
        <TabPanel name="B">Panel B</TabPanel>
        <TabPanel name="C">Panel C</TabPanel>
      </div>
    </Tabs>
    <Tabs class="mb-3 mt-6 py-2" v-model="state3">
      <h2 class="text-xl font-bold mb-4">Disabled Tab</h2>
      <TabList class="border-b border-gray-500">
        <Tab
          name="A"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab A</Tab
        >
        <Tab
          name="B"
          disabled
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab B</Tab
        >
        <Tab
          name="C"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab C</Tab
        >
        <Tab
          name="D"
          class="px-3 py-1 rounded-sm border border-b-0 border-gray-500 rounded-b-none inline-block mr-1"
          >Tab D</Tab
        >
      </TabList>
      <TabPanel name="A">Panel A</TabPanel>
      <TabPanel name="B">Panel B</TabPanel>
      <TabPanel name="C">Panel C</TabPanel>
      <TabPanel name="D">Panel D</TabPanel>
    </Tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Tabs, Tab, TabList, TabPanel /*, useTabs*/ } from '@varia/widgets'

export default defineComponent({
  components: {
    Tab,
    Tabs,
    TabList,
    TabPanel,
  },
  setup() {
    const state1 = ref('A')
    const state2 = ref('B')
    const state3 = ref('C')

    return {
      state1,
      state2,
      state3,
    }
  },
})
</script>

<style scoped lang="postcss">
.wrapper ::v-deep([role='tab'][aria-selected='true']) {
  @apply bg-teal-500 border-teal-600 text-white;
}
.wrapper ::v-deep([role='tab'][aria-disabled='true']) {
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
