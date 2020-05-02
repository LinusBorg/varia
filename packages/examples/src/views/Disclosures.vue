<template>
  <div>
    <DisclosureTrigger class="btn border px-2 py-1 rounded">
      Show the hidden Secret
    </DisclosureTrigger>
    <DisclosureContent>
      Hidden!
    </DisclosureContent>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import {
  DisclosureTrigger,
  DisclosureContent,
  useDisclosure,
} from 'vue-aria-widgets'

export default defineComponent({
  components: {
    DisclosureTrigger,
    DisclosureContent,
  },
  setup() {
    const show = ref(false) as Ref<boolean>
    useDisclosure(show)

    return {}
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
