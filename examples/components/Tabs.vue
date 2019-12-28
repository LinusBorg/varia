<template>
  <div>
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
          :class="activeTab === 'users' && 'active'"
          v-bind="a11y.tabs.users"
          @click="setTab('users')"
          ref="users"
          >Users</a
        >
      </li>
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
          :class="activeTab === 'messages' && 'active'"
          v-bind="a11y.tabs.messages"
          @click="setTab('messages')"
          ref="messages"
          >Messages</a
        >
      </li>
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
          :class="activeTab === 'settings' && 'active'"
          v-bind="a11y.tabs.settings"
          @click="setTab('settings')"
          ref="settings"
          >Settings</a
        >
      </li>
    </ul>
    <div>
      <div
        class="tab-panel"
        v-show="activeTab === 'users'"
        v-bind="a11y.tabPanels.users"
      >
        Content for Tab 1: Users
      </div>
      <div
        class="tab-panel"
        v-show="activeTab === 'messages'"
        v-bind="a11y.tabPanels.messages"
      >
        Content for Tab 2: Messages
      </div>
      <div
        class="tab-panel"
        v-show="activeTab === 'settings'"
        v-bind="a11y.tabPanels.settings"
      >
        Content for Tab 3: Settings
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { useTabs } from '../../src'
export default createComponent({
  setup(_, ctx) {
    const tabNames = new Set(['users', 'messages', 'settings'])
    const activeTab = ref('users')
    const setTab = (tab: string) => tabNames.has(tab) && (activeTab.value = tab)

    // A11y
    const tabsA11y = useTabs(ctx, Array.from(tabNames), activeTab, {
      autoSelect: true,
    })
    return {
      activeTab,
      setTab,
      a11y: tabsA11y.attributes,
    }
  },
})
</script>

<style scoped></style>
