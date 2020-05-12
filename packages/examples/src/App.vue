<template>
  <div id="container">
    <nav id="nav" aria-labelledby="main-nav-label">
      <span id="main-nav-label" data-varia-visually-hidden="true"
        >main navigation</span
      >
      <router-link to="/">Home</router-link>
      <router-link to="/buttons" :aria-current="isCurrentRoute('Buttons')">
        Buttons
      </router-link>
      <router-link
        to="/disclosures"
        :aria-current="isCurrentRoute('Disclosures')"
      >
        Disclosures
      </router-link>
      <router-link
        to="/accordions"
        :aria-current="isCurrentRoute('Accordions')"
      >
        Accordions
      </router-link>
      <router-link to="/popovers" :aria-current="isCurrentRoute('Popovers')">
        Popovers
      </router-link>
      <router-link to="/focustraps" :aria-current="isCurrentRoute('FousTraps')">
        FocusTraps
      </router-link>
      <router-link to="/tabs" :aria-current="isCurrentRoute('Tabs')">
        Tabs
      </router-link>
    </nav>
    <main id="main" class="text-left mx-auto">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute()
    return {
      isCurrentRoute: (name: string) =>
        route.name === name ? 'page' : undefined,
    }
  },
})
</script>

<style>
#container {
  display: flex;
  margin: 0;
  min-height: 100vh;
}

#nav {
  padding: 30px;
  flex: 0 0 250px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  display: block;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#main {
  margin: 30px;
  max-width: 980px;
  flex: 1 1 auto;
}
</style>
