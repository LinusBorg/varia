<template>
  <div clas="">
    <div ref="element" v-bind="attributes"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, reactive, watch } from 'vue'
import { useSlider } from './use-slider'
export default defineComponent({
  name: 'Slider',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
    jump: {
      type: Number,
      required: false,
    },
  },
  setup(props, { emit }) {
    const { max, min, step, jump } = toRefs(props)

    const value = computed({
      get: () => props.modelValue,
      set: (val: number) => emit('update:modelValue', val),
    })

    // Keyboard Control
    const slider = useSlider(
      value,
      reactive({
        max,
        min,
        step,
        jump,
      })
    )

    return {
      ...slider,
    }
  },
})
</script>

<style scoped></style>
