<template>
  <div>
    <h1 class="text-3xl mb-5">FocusTrap</h1>
    <label for="focustrap-input-before">
      Input before the Trap<br />
      <input
        class="border border-gray-300"
        id="#focustrap-input-before"
        type="text"
      />
    </label>
    <hr class="my-3" />
    <div>
      <FocusTrap v-model="focusTrap">
        <ToggleButton
          class="btn border px-2 py-1 rounded mb-2"
          v-model="focusTrap"
        >
          Toggle FocusTrap (current: {{ focusTrap ? 'on' : 'off' }})
        </ToggleButton>
        <br />
        <button class="btn border px-2 py-1 rounded mb-2">Button 1</button
        ><br />
        <button class="btn border px-2 py-1 rounded mb-2">Button 2</button
        ><br />
        <button class="btn border px-2 py-1 rounded mb-2">Button 3</button
        ><br />
      </FocusTrap>
    </div>
    <hr class="my-3" />
    <label for="focustrap-input-after">
      Input after the trap <br />
      <input
        class="border border-gray-300"
        id="#focustrap-input-after"
        type="text"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { FocusTrap, ToggleButton } from '@varia/widgets'

export default defineComponent({
  name: 'FocusTraps',
  components: {
    FocusTrap,
    ToggleButton,
  },
  setup: () => ({
    focusTrap: ref(false),
  }),
})
</script>

<style lang="postcss">
[aria-pressed='true'] {
  @apply bg-teal-600 text-white;
}
</style>
