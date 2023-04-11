<script setup lang="ts">
import Quill from "quill";
import QuillMarkdown from "quilljs-markdown";

Quill.register("modules/QuillMarkdown", QuillMarkdown, true);

const props = defineProps<{
  noteKey: string;
}>();

const noteData = useNoteData(props.noteKey);

const contentValue = ref("");

let editorInstance: Quill | undefined;
function loadEditor(editor: { instance: Quill }) {
  editorInstance = editor.instance;
}

watchDebounced(
  contentValue,
  () => {
    if (contentValue.value && noteData.data.value?.content !== contentValue.value) {
      noteData.update({ content: contentValue.value });
    }
  },
  { debounce: 500, maxWait: 1000 }
);

watch(
  noteData.data,
  async () => {
    if (noteData.data.value && noteData.data.value?.content !== contentValue.value) {
      let focused = false;
      if (editorInstance?.hasFocus()) {
        focused = true;
        editorInstance?.blur();
      }
      await nextTick();
      contentValue.value = noteData.data.value.content;
      await nextTick();
      if (focused) {
        editorInstance?.focus();
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="editorContainer">
    <Editor v-model="contentValue" @load="loadEditor" />
  </div>
</template>

<style scoped lang="scss">
.editorContainer {
  height: 100%;
  overflow: hidden;
}
.p-editor-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
