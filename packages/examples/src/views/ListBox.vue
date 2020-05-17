<template>
  <div>
    <h1 class="text-3xl mb-5">ListBox</h1>
    <h2 class="text-2xl mb-3">Basic Listbox</h2>
    <ListBox v-model="state" :virtual="true" autoSelect>
      <ListBoxItem v-for="item in items" :key="item" :item="item">
        {{ item }}
      </ListBoxItem>
    </ListBox>
    <hr />
    {{ state.join(', ') }}
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
    const items = reactive(['Shoes', 'Jeans' /*, 'Tops', 'Accessoires'*/])
    const state = ref<string[]>([])
    return {
      items,
      state,
    }
  },
})
</script>
<style lang="postcss">
/* [role="option"][data-varia-focus="true"] {
  border: 1px solid red;
} */
</style>
