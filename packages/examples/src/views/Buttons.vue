<template>
  <div>
    <Button>
      Click me!
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button } from 'vue-aria-widgets'
export default defineComponent({
  components: {
    Button,
  },
})
</script>

<style scoped></style>
