<template>
  <div>
    <h1 class="text-3xl mb-5">Accordions</h1>
    <div class="divide-y divide-gray-300">
      <h2 class="text-2xl mb-4">Basic Accordion</h2>
      <Accordion :modelValue="state1">
        <div class="border border-gray-300 px-3 py-2">
          <AccordionHeader tag="div" :h="3" name="A" class="font-bold"
            >Header A</AccordionHeader
          >
          <AccordionContent name="A">
            <hr class="mb-2" />
            Content A
          </AccordionContent>
        </div>
        <div class="border border-gray-300 px-3 py-2">
          <AccordionHeader tag="div" :h="3" name="B" class="font-bold"
            >Header B</AccordionHeader
          >
          <AccordionContent name="B">Content B</AccordionContent>
        </div>
        <div class="border border-gray-300 px-3 py-2">
          <AccordionHeader tag="div" :h="3" name="C" class="font-bold"
            >Header C</AccordionHeader
          >
          <AccordionContent name="C">Content C</AccordionContent>
        </div>
      </Accordion>
      <h2 class="text-2xl pt-6 mb-4">Accordion: Multiple Expanded Panels</h2>
      <Accordion multiple>
        <AccordionHeader tag="div" :h="3" name="A" class="font-bold"
          >Header A</AccordionHeader
        >
        <AccordionContent name="A">Content A</AccordionContent>
        <AccordionHeader tag="div" :h="3" name="B" class="font-bold"
          >Header B</AccordionHeader
        >
        <AccordionContent name="B">Content B</AccordionContent>
        <AccordionHeader tag="div" :h="3" name="C" disabled class="font-bold"
          >Header C</AccordionHeader
        >
        <AccordionContent name="C">Content C</AccordionContent>
      </Accordion>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { Accordion, AccordionHeader, AccordionContent } from '@varia/widgets'

export default defineComponent({
  name: 'Accordions',
  components: {
    Accordion,
    AccordionContent,
    AccordionHeader,
  },
  setup() {
    const state1 = reactive(new Set('A'))
    return {
      state1,
    }
  },
})
</script>

<style lang="postcss" scoped>
::v-deep([role='button'][aria-disabled='true']) {
  @apply text-gray-600;
}
</style>
