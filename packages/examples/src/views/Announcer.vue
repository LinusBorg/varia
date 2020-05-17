<template>
  <div>
    <label for="announcer-message">
      Enter Message for Announcer <br />
      <textarea
        class="__announcer-area border border-gray-300 rounded-sm"
        v-model="message"
      /><br />
    </label>
    <button @click="announce">Announce Message</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAnnouncer } from '@varia/widgets'
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
<style lang="postcss" scoped>
.__announcer-area {
  min-width: 400px;
  min-height: 300px;
}
</style>
