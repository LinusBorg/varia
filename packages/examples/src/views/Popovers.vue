<template>
  <div>
    <PopoverTrigger class="btn border px-2 py-1 rounded">
      Show the Popover!
    </PopoverTrigger>
    <PopoverContent class="content border bg-white px-3 py-2" focusOnOpen>
      <h3>Welcome to the Popup!</h3>
      <ul>
        <li tabindex="0">Option #1</li>
        <li>Option #2</li>
        <li>Option #3</li>
      </ul>
    </PopoverContent>
    <p class="mb-3 p-2">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Diam sit amet nisl
      suscipit adipiscing bibendum est ultricies. Est lorem ipsum dolor sit.
      Nibh sit amet commodo nulla facilisi nullam. Interdum velit euismod in
      pellentesque massa. Eget duis at tellus at urna condimentum mattis
      pellentesque id. Nascetur ridiculus mus mauris vitae ultricies leo.
      Suscipit tellus mauris a diam. Viverra maecenas accumsan lacus vel
      facilisis. Volutpat diam ut venenatis tellus in metus. In massa tempor nec
      feugiat nisl pretium fusce. Praesent tristique magna sit amet purus
      gravida. Fringilla phasellus faucibus scelerisque eleifend donec pretium.
      Malesuada pellentesque elit eget gravida cum. Non curabitur gravida arcu
      ac tortor dignissim convallis aenean et. Lacus viverra vitae congue eu
      consequat ac felis donec. Tristique magna sit amet purus. Scelerisque
      purus semper eget duis.
    </p>
    <p class="mb-3 p-2">
      Mattis vulputate enim nulla aliquet porttitor lacus luctus. Tempor id eu
      nisl nunc mi. Vitae proin sagittis nisl rhoncus. Eget aliquet nibh
      praesent tristique magna sit amet purus. Et sollicitudin ac orci phasellus
      egestas tellus rutrum. Sed vulputate odio ut enim blandit volutpat
      maecenas volutpat. Lorem ipsum dolor sit amet consectetur. Amet tellus
      cras adipiscing enim eu turpis. Dui faucibus in ornare quam viverra orci
      sagittis eu. Tempus urna et pharetra pharetra massa massa ultricies mi
      quis. Habitant morbi tristique senectus et netus et. Sit amet nisl
      suscipit adipiscing bibendum est ultricies integer. Pharetra pharetra
      massa massa ultricies mi quis hendrerit. Tempus urna et pharetra pharetra
      massa massa ultricies. Rhoncus aenean vel elit scelerisque mauris. Amet
      mattis vulputate enim nulla aliquet porttitor lacus.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PopoverTrigger, PopoverContent, usePopover } from 'vue-aria-widgets'

export default defineComponent({
  components: {
    PopoverTrigger,
    PopoverContent,
  },
  setup() {
    const { show } = usePopover()

    return {
      show,
    }
  },
})
</script>

<style scoped lang="postcss">
.content {
  max-width: 300px;
}

/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0; 
} */
</style>
