<template>
  <div class="flex flex-col justify-center items-center w-full">
    <h2 class="text-4xl mb-5">Signup for this cool App!</h2>
    <form name="signup" action="">
      <div class="mb-2">
        <label :for="id('user')">
          Username <br />
          <input :id="id('user')" type="text" class="border border-gray-300" />
        </label>
      </div>
      <div class="mb-2">
        <label :for="id('pw')">
          Passwort <br />
          <input :id="id('pw')" type="pasword" class="border border-gray-300" />
        </label>
      </div>
      <p class="text-right">
        <button class="btn border px-2 py-1 mr-2 rounded" type="submit">
          Submit
        </button>
        <button class="text-red-700" @click="$emit('close')">Close</button>
      </p>
    </form>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { createCachedIdFn } from '@varia/widgets'
export default defineComponent({
  name: 'SignUpForm',
  setup() {
    return {
      id: createCachedIdFn(),
    }
  },
})
</script>
<style lang="postcss"></style>
