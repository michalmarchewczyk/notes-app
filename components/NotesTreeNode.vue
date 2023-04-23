<script setup lang="ts">
import { TreeNode } from "primevue/tree";
import { vOnClickOutside } from "@vueuse/components";
import InputText from "primevue/inputtext";
import NoteData from "~/utils/NoteData";
import FolderData from "~/utils/FolderData";

const userData = useSharedUserData();

const { renameNote } = useSharedNotes();
const { renameFolder } = useSharedFolders();

const noteDates = computed(() => !!userData.data.value?.noteDates);

const props = defineProps<{
  node: Omit<TreeNode, "data"> & { data: NoteData | FolderData };
}>();

const rename = ref(false);
const renameValue = ref<string>("");
const inputRef = ref<{ $el: HTMLInputElement } | null>(null);

async function enableRename() {
  rename.value = true;
  renameValue.value = props.node.label ?? "";
  await nextTick();
  inputRef.value?.$el.focus();
  inputRef.value?.$el.select();
}
async function disableRename() {
  rename.value = false;
  if (props.node.label !== renameValue.value && renameValue.value !== "") {
    if (props.node.type === "note") {
      await renameNote(props.node.data.id, renameValue.value);
    } else {
      await renameFolder(props.node.data.id, renameValue.value);
    }
  }
}

defineExpose({
  enableRename,
});
</script>

<template>
  <div v-on-click-outside="disableRename" class="node" @dblclick="enableRename">
    <InputText
      v-if="rename"
      ref="inputRef"
      v-model="renameValue"
      @keydown.stop
      @keyup.enter="disableRename"
      @keyup.esc="disableRename"
    />
    <div v-else>
      <span>{{ props.node.label }}</span>
      <span v-if="noteDates">{{ formatDate(props.node.data.created.toDate()) }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.node {
  height: 100%;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  input {
    width: 100%;
    height: 32px;
    margin: 0.2rem;
  }
  div {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    span {
      padding-left: 0.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
      flex-shrink: 1;
    }
    span:nth-child(2) {
      margin-left: 0.3rem;
      font-size: 0.8rem;
      color: var(--text-color-secondary) !important;
      opacity: 0.7;
      flex-shrink: 100000;
    }
  }
}
</style>
