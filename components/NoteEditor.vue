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

const lastUpdates = ref<string[]>([]);

watchDebounced(
  contentValue,
  () => {
    if (contentValue.value && noteData.data.value?.content !== contentValue.value) {
      lastUpdates.value.push(contentValue.value.replaceAll("<p><br></p>", "<br>"));
      lastUpdates.value = lastUpdates.value.slice(-10);
      noteData.update({ content: contentValue.value.replaceAll("<p><br></p>", "<br>") });
    }
  },
  { debounce: 200, maxWait: 500 }
);

watch(
  noteData.data,
  async () => {
    if (
      noteData.data.value &&
      noteData.data.value?.content !== contentValue.value &&
      !lastUpdates.value.includes(noteData.data.value?.content)
    ) {
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

const enabledFormats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "script",
  "link",
  "code",
  "blockquote",
  "header",
  "list",
  "align",
  "code-block",
];
</script>

<template>
  <div class="editor-container">
    <ScrollPanel>
      <Editor v-model="contentValue" :formats="enabledFormats" @load="loadEditor">
        <template #toolbar>
          <NoteEditorToolbar />
        </template>
      </Editor>
    </ScrollPanel>
  </div>
</template>

<style scoped lang="scss">
.editor-container {
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  width: calc(100% - 92px);
  @media (max-height: 720px) {
    width: calc(100% - 146px);
  }
  .p-scrollpanel {
    height: 100%;
    max-height: 100%;
    width: 100%;
    max-width: 1032px;
    margin: 0 auto;
    :deep(.p-scrollpanel-bar-y) {
      background-color: var(--surface-400);
      border-radius: 10px;
      width: 10px;
    }
  }
}
.p-editor-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  :deep(.p-editor-toolbar) {
    position: fixed;
    right: 32px;
    top: 50%;
    --height: 600px;
    height: var(--height);
    margin-top: calc(var(--height) / -2);
    width: 56px;
    border: none !important;
    z-index: 100;
    background-color: transparent !important;
    @media (max-height: 720px) {
      --height: 304px;
      width: 110px;
    }
  }
  :deep(.p-editor-content) {
    background-color: transparent;
    border: none !important;
    .ql-editor {
      background-color: transparent !important;
      color: var(--text-color);
      padding-bottom: 60px;
    }
  }
}
</style>
