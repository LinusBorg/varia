<template>
  <div>
    <label for="announcer-message">
      Enter Message for Announcer <br />
      <textarea v-model="message" /><br />
    </label>
    <button @click="announce">Announce Message</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAnnouncer } from 'vue-aria-widgets'
export default defineComponent({
  name: 'AnnouncerDemos',
  setup() {
    const { set } = useAnnouncer()
    const message = ref('')
    return {
      message,
      announce: () => message.value && set(message.value),
    }
  },
})
</script>
<style lang="postcss"></style>
