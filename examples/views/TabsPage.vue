<template>
  <div>
    <h1>Tabs</h1>
    <Tabs />
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import Tabs from '../components/Tabs.vue'
export default createComponent({
  components: {
    Tabs,
  },
  setup() {},
})
</script>

<style scoped></style>
