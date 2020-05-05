<template>
  <div>
    <DisclosureTrigger>
      Show the hidden Secret
    </DisclosureTrigger>
    <transition appear name="fade">
      <DisclosureContent>
        Hidden!
      </DisclosureContent>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    useDisclosure()

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
