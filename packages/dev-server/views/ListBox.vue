<template>
  <div>
    <h1 class="text-3xl mb-5">ListBox</h1>
    <label>
      <input v-model="virtual" type="checkbox" /> Virtual mode
      (aria-activedescendant)
    </label>
    <h2 class="text-2xl mb-3">Basic Listbox</h2>
    <ListBox
      v-model="state"
      :virtual="virtual"
      class="border border-gray-300 rounded-sm p-2 m-3 space-y-2"
    >
      <ListBoxItem
        v-for="item in items"
        :key="item"
        :item="item"
        class="border border-gray-300 px-3 py-2"
      >
        {{ item }}
      </ListBoxItem>
    </ListBox>
    <hr />
    <strong>Selected Items:</strong> {{ state.join(', ') }}
    <h2 class="text-2xl mt-4 mb-3">Auto-Selecting Listbox</h2>
    <ListBox
      v-model="state2"
      :virtual="virtual"
      autoSelect
      class="border border-gray-300 rounded-sm p-2 m-3 space-y-2"
    >
      <ListBoxItem
        v-for="item in items"
        :key="item"
        :item="item"
        class="border border-gray-300 px-3 py-2"
      >
        {{ item }}
      </ListBoxItem>
    </ListBox>
    <hr />
    <strong>Selected Items:</strong> {{ state2.join(', ') }}
    <h2 class="text-2xl mt-4 mb-3">Multi-Select Listbox</h2>
    <ListBox
      v-model="state3"
      multiple
      :virtual="virtual"
      class="border border-gray-300 rounded-sm p-2 m-3 space-y-2"
    >
      <ListBoxItem
        v-for="item in items"
        :key="item"
        :item="item"
        class="border border-gray-300 px-3 py-2"
      >
        {{ item }}
      </ListBoxItem>
    </ListBox>
    <hr />
    <strong>Selected Items:</strong> {{ state3.join(', ') }}
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { ListBox, ListBoxItem } from '@varia/widgets'

export default defineComponent({
  name: 'ListBoxExamples',
  components: {
    ListBox,
    ListBoxItem,
  },
  setup() {
    const items = reactive(['Shoes', 'Jeans', 'Tops', 'Pants', 'Accessoires'])
    const state = ref<string[]>([])
    const state2 = ref<string[]>(['Tops'])
    const state3 = ref<string[]>([])
    return {
      virtual: ref(false),
      items,
      state,
      state2,
      state3,
    }
  },
})
</script>
<style lang="postcss">
[role='listbox'] {
  max-width: 400px;
  max-height: 200px;
  overflow-y: scroll;
}
[role='option'][aria-selected='true'] {
  @apply bg-teal-500 border-teal-600 text-white;
}
[role='option'][aria-disabled='true'] {
  @apply bg-gray-200 text-gray-600;
}
</style>
