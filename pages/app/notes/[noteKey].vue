<script setup lang="ts">
import NoteEditor from "~/components/NoteEditor.vue";

const route = useRoute();
</script>

<template>
  <div class="container">
    <ClientOnly>
      <NoteEditor :note-key="route.params.noteKey.toString()" />
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.container {
  flex: 1;
}
</style>
