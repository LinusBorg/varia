<template>
  <div class="home">
    Test <br />
    <input type="text" id="1" /><br />
    Another Test <br />
    <input type="text" id="2" />
    <hr />
    <ListBox />
  </div>
</template>

<script>
import { createComponent, watch } from '@vue/composition-api'
import { useGlobalFocusTracker } from '../../src'
import ListBox from '../components/ListBox.vue'

export default createComponent({
  name: 'home',
  components: {
    ListBox,
  },
  setup() {
    const tracker = useGlobalFocusTracker()
    // watch(tracker.currentEl, el => {
    //   console.log(el)
    //   console.log(tracker.tabDirection.value)
    // })
  },
})
</script>
