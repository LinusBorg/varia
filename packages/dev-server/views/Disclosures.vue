<template>
  <div>
    <h1 class="text-3xl mb-5">Disclosures</h1>
    <Disclosure v-model="show">
      <DisclosureTrigger class="btn border px-2 py-1 rounded">
        Show the hidden Secret
      </DisclosureTrigger>
      <DisclosureContent class="mt-2 border border-gray-300 p-4">
        Hidden!
      </DisclosureContent>
    </Disclosure>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import {
  DisclosureTrigger,
  DisclosureContent,
  Disclosure,
} from '@varia/widgets'

export default defineComponent({
  components: {
    Disclosure,
    DisclosureTrigger,
    DisclosureContent,
  },
  setup() {
    const show = ref(false) as Ref<boolean>
    return {
      show,
    }
  },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
