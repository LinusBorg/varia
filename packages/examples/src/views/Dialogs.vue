<template>
  <div>
    <h2 class="text-3xl mb-5">Modal Dialogs</h2>
    <Dialog v-model="isDialogOpen">
      <DialogTrigger>Click to Open Modal Dialog</DialogTrigger>
      <DialogContent focusOnOpen>
        <div class="absolute top-0 right-0 bottom-0 left-0 flex z-10">
          <div
            class="__modal-backdrop bg-black bg-opacity-50 flex justify-center items-center w-full h-full"
          >
            <div class="__modal-dialog bg-white shadow-xl rounded p-4 relative">
              <Button
                @click="isDialogOpen = false"
                arial-label="Close Dialog"
                class="absolute top-0 right-0 mr-2 mt-2 border border-gray-300 p-3"
              >
                X
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Button, Dialog, DialogTrigger, DialogContent } from '@varia/widgets'
export default defineComponent({
  name: 'Dialogs',
  components: {
    Button,
    Dialog,
    DialogContent,
    DialogTrigger,
  },
  setup: () => ({
    isDialogOpen: ref(false),
  }),
})
</script>
<style lang="postcss">
.__modal-dialog {
  min-width: 700px;
  min-height: 500px;
}
</style>
