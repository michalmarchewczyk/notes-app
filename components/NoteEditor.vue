<script setup lang="ts">
import hljs from "highlight.js/lib/common";
// eslint-disable-next-line import/no-named-as-default
import Quill from "quill";
import QuillMarkdown from "quilljs-markdown";
import Editor, { EditorSelectionChangeEvent } from "primevue/editor";
import NoteEditorTooltip from "~/components/NoteEditorTooltip.vue";

Quill.register("modules/QuillMarkdown", QuillMarkdown, true);

const props = defineProps<{
  noteKey: string;
}>();

const noteData = useNoteData(props.noteKey);

const userData = useSharedUserData();

const editorLineNumbers = computed(() => !!userData.data.value?.editorLineNumbers);

const contentValue = ref("");

const saving = ref(false);

let editorInstance: Quill | undefined;
function loadEditor(editor: { instance: Quill }) {
  editorInstance = editor.instance;
}

const lastUpdates = ref<string[]>([]);

watchDebounced(
  contentValue,
  async () => {
    if (contentValue.value && noteData.data.value?.content !== contentValue.value) {
      saving.value = true;
      lastUpdates.value.push(contentValue.value.replaceAll("<p><br></p>", "<br>"));
      lastUpdates.value = lastUpdates.value.slice(-10);
      await noteData.update({ content: contentValue.value.replaceAll("<p><br></p>", "<br>") });
      saving.value = false;
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

const editorComponent = ref<InstanceType<typeof Editor> | undefined>();
const currentSelectionPosition = reactive<{
  visible: boolean;
  left: number;
  top: number;
}>({
  visible: false,
  left: 0,
  top: 0,
});

function onSelectionChange(event: EditorSelectionChangeEvent) {
  if (event.range && event.range.length > 0) {
    const bounds = editorInstance?.getBounds(event.range.index, event.range.length);
    const editorRect = editorComponent.value?.$el.getBoundingClientRect();
    if (bounds) {
      currentSelectionPosition.visible = true;
      currentSelectionPosition.top = bounds.top + bounds.height + 10 + editorRect.top;
      currentSelectionPosition.left = bounds.left + (bounds.right - bounds.left) / 2 + -106 + editorRect.left;
    }
  } else {
    currentSelectionPosition.visible = false;
  }
}

const enabledFormats = [
  "bold",
  "italic",
  "underline",
  "strike",
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
      <Editor
        ref="editorComponent"
        v-model="contentValue"
        :formats="enabledFormats"
        :modules="{
          QuillMarkdown: true,
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
        }"
        placeholder="Start typing..."
        :class="{
          'line-numbers': editorLineNumbers,
        }"
        @load="loadEditor"
        @selection-change="onSelectionChange"
      >
        <template #toolbar>
          <NoteEditorToolbar />
          <div
            class="selection-tooltip"
            :style="{
              visibility: currentSelectionPosition.visible ? 'visible' : 'hidden',
              top: currentSelectionPosition.top + 'px',
              left: currentSelectionPosition.left + 'px',
            }"
          >
            <NoteEditorTooltip />
          </div>
        </template>
      </Editor>
    </ScrollPanel>
    <span class="saving">{{ saving ? "Saving..." : "Saved" }}</span>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/syntax-colors.scss";
@import "../assets/editor-styles.scss";
@import "../assets/line-numbers.scss";
.selection-tooltip {
  position: fixed;
  width: 212px;
  height: 96px;
}
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
      z-index: 0;
      margin-left: 10px;
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
    z-index: 10000;
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
      padding-bottom: 60px;
      min-height: calc(100vh - 100px);
      @include editor-styles;
    }
    .ql-tooltip {
      @include editor-tooltip-styles;
    }
  }
  &.line-numbers {
    :deep(.p-editor-content) {
      .ql-editor {
        @include line-numbers;
      }
    }
  }
}
.saving {
  position: absolute;
  bottom: 18px;
  left: 18px;
  font-weight: 600;
  font-size: 18px;
  color: var(--text-color);
  opacity: 0.3;
  z-index: 10000;
  user-select: none;
  pointer-events: none;
}
</style>
