<template>
  <div>
    <h1>FocusTrap</h1>
    <label for="focustrap-input-before"
      >Input before the Trap<input
        class="border border-gray-300"
        id="#focustrap-input-before"
        type="text"
    /></label>
    <div>
      <FocusTrap v-model="focusTrap">
        <button @click="focusTrap = !focusTrap">Toggle FocusTrap</button><br />
        <button>Button 1</button><br />
        <button>Button 2</button><br />
        <button>Button 3</button><br />
      </FocusTrap>
    </div>
    <label for="focustrap-input-after"
      >Input after the trap<input
        class="border border-gray-300"
        id="#focustrap-input-after"
        type="text"
    /></label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { FocusTrap } from '@varia/widgets'

export default defineComponent({
  name: 'FocusTraps',
  components: {
    FocusTrap,
  },
  setup: () => ({
    focusTrap: ref(false),
  }),
})
</script>

<style scoped></style>
