<template>
  <div>
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" v-for="tab in tabs" :key="tab.name">
        <a
          v-ref-fn="tabsA11y.fn"
          href="#"
          class="nav-link"
          :class="activeTab === tab.name && 'active'"
          v-bind="tabsA11y.tab(tab.name)"
          @click="setTab(tab.name)"
          >{{ tab.label }}</a
        >
      </li>
    </ul>
    <div>
      <div
        class="tab-panel"
        v-show="activeTab === 'users'"
        v-bind="tabsA11y.tabPanel('users')"
      >
        Content for Tab 1: Users
      </div>
      <div
        class="tab-panel"
        v-show="activeTab === 'messages'"
        v-bind="tabsA11y.tabPanel('messages')"
      >
        Content for Tab 2: Messages
      </div>
      <div
        class="tab-panel"
        v-show="activeTab === 'settings'"
        v-bind="tabsA11y.tabPanel('settings')"
      >
        Content for Tab 3: Settings
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useTabs, refFn } from '../../src'
const tabs = [
  {
    name: 'users',
    label: 'Users',
  },
  {
    name: 'messages',
    label: 'Messages & Notifications',
  },
  {
    name: 'settings',
    label: 'Settings',
  },
]
const tabNames = tabs.map(t => t.name)

export default defineComponent({
  directives: {
    refFn,
  },
  setup(_, ctx) {
    const activeTab = ref('users')
    const setTab = (tab: string) => (activeTab.value = tab)

    // A11y
    const tabsA11y = useTabs(activeTab, {
      autoSelect: true,
    })
    return {
      tabs,
      activeTab,
      setTab,
      tabsA11y,
    }
  },
})
</script>

<style scoped></style>
