<template>
  <div>
    <h1 class="text-3xl mb-5">Buttons</h1>
    <label>
      <input v-model="virtualButton" type="checkbox" /> Div as Button
    </label>
    <div class="divide-y divide-gray-300">
      <div class="mb-3 mt-6 py-2">
        <h2 class="text-xl mb-2">Normal</h2>
        <Button :tag="tag" class="btn border px-2 py-1 rounded" @click="alert">
          Click me!
        </Button>
      </div>
      <div class="mb-3 pt-5 pb-2">
        <h2 class="text-xl mb-2">Disabled</h2>
        <Button
          :tag="tag"
          disabled
          @click="alert"
          class="btn border px-2 py-1 rounded bg-gray-200 text-gray-700"
        >
          Click me!
        </Button>
      </div>
      <div class="mb-3 pt-5 pb-2">
        <h2 class="text-xl mb-2">
          Disabled, but focusable
        </h2>
        <Button
          :tag="tag"
          disabled
          focusable
          @click="alert"
          class="btn border px-2 py-1 rounded bg-gray-200 text-gray-700"
        >
          Click me!
        </Button>
      </div>
      <div class="mb-3 pt-5 pb-2">
        <h2 class="text-xl mb-2">Div as a button</h2>
        <Button
          tag="div"
          class="btn border inline-block px-2 py-1 rounded"
          @click="alert"
        >
          Click me!
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Button } from '@varia/widgets'
export default defineComponent({
  components: {
    Button,
  },
  setup() {
    const alert = () => {
      window.alert('Button clicked!')
    }
    const virtualButton = ref(false)
    const tag = computed(() => (virtualButton.value ? 'DIV' : undefined))
    return {
      alert,
      virtualButton,
      tag,
    }
  },
})
</script>

<style scoped lang="postcss">
.btn:active {
  @apply bg-gray-100;
}
</style>
