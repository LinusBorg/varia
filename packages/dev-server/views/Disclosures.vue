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
import { defineComponent, ref } from 'vue'
import {
  DisclosureTrigger,
  DisclosureContent,
  useDisclosure,
} from '@varia/widgets'

export default defineComponent({
  components: {
    DisclosureTrigger,
    DisclosureContent,
  },
  setup() {
    const isOpen = ref(false)
    useDisclosure(isOpen)

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
