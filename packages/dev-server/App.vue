<template>
  <div id="_wrapper">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/buttons">Buttons</router-link> |
      <router-link to="/disclosures">Disclosures</router-link> |
      <router-link to="/popovers">Popovers</router-link> |
      <router-link to="/tabs">Tabs</router-link>
    </div>
    <main id="main" class="text-left mx-auto">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  data: () => ({ count: 0 }),
})
</script>

<style scoped>
h1 {
  color: #4fc08d;
}

h1,
p {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
