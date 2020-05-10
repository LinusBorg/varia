<template>
  <div>
    <h2>Basic Accordion</h2>
    <Accordion :modelValue="state1">
      <AccordionHeader :h="3" name="A">Header A</AccordionHeader>
      <AccordionContent name="A">Content A</AccordionContent>
      <AccordionHeader :h="3" name="B">Header B</AccordionHeader>
      <AccordionContent name="B">Content B</AccordionContent>
      <AccordionHeader :h="3" name="C">Header C</AccordionHeader>
      <AccordionContent name="C">Content C</AccordionContent>
    </Accordion>
    <h2 class="mt-4">Accordion: Multiple Expanded Panels</h2>
    <Accordion multiple>
      <AccordionHeader :h="3" name="A">Header A</AccordionHeader>
      <AccordionContent name="A">Content A</AccordionContent>
      <AccordionHeader :h="3" name="B">Header B</AccordionHeader>
      <AccordionContent name="B">Content B</AccordionContent>
      <AccordionHeader :h="3" name="C" disabled>Header C</AccordionHeader>
      <AccordionContent name="C">Content C</AccordionContent>
    </Accordion>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRaw } from 'vue'
import { Accordion, AccordionHeader, AccordionContent } from 'vue-aria-widgets'

export default defineComponent({
  name: 'Accordions',
  components: {
    Accordion,
    AccordionContent,
    AccordionHeader,
  },
  setup() {
    const state1 = reactive(new Set('A'))
    console.log(toRaw(state1))
    return {
      state1,
    }
  },
})
</script>

<style scoped></style>
