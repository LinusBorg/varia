<template>
  <div class="divide-y divide-gray-300">
    <div class="mb-3 mt-6 py-2">
      <h2 class="text-xl font-bold mb-2">Normal</h2>
      <Button class="btn border px-2 py-1 rounded" @click="alert">
        Click me!
      </Button>
    </div>
    <div class="mb-3 pt-5 pb-2">
      <h2 class="text-xl font-bold mb-2">Disabled</h2>
      <Button
        disabled
        @click="alert"
        class="btn border px-2 py-1 rounded bg-gray-200 text-gray-700"
      >
        Click me!
      </Button>
    </div>
    <div class="mb-3 pt-5 pb-2">
      <h2 class="text-xl font-bold mb-2">
        Disabled, but focusable programmatically
      </h2>
      <Button
        disabled
        focusable
        @click="alert"
        class="btn border px-2 py-1 rounded bg-gray-200 text-gray-700"
      >
        Click me!
      </Button>
    </div>
    <div class="mb-3 pt-5 pb-2">
      <h2 class="text-xl font-bold mb-2">Div as a button</h2>
      <Button
        tag="div"
        class="btn border inline-block px-2 py-1 rounded"
        @click="alert"
      >
        Click me!
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button } from 'vue-aria-widgets'
export default defineComponent({
  components: {
    Button,
  },
  setup() {
    const alert = () => {
      window.alert('Button clicked!')
    }
    return {
      alert,
    }
  },
})
</script>

<style scoped lang="postcss">
.btn:active {
  @apply bg-gray-100;
}
</style>
