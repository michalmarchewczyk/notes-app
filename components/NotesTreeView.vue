<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import NoteData from "~/utils/NoteData";
import FolderData from "~/utils/FolderData";
import NoteContextMenu from "~/components/NoteContextMenu.vue";
import FolderContextMenu from "~/components/FolderContextMenu.vue";
import NotesTreeNode from "~/components/NotesTreeNode.vue";

const { folders } = useSharedFolders();
const { notes } = useSharedNotes();

const selectedKey = useState<string | null>("selectedKey", () => null);
const nodeRefs = ref<Record<string, InstanceType<typeof NotesTreeNode>>>({});

const contextNote = ref<NoteData | null>(null);
const contextFolder = ref<FolderData | null>(null);
const noteContextMenu = ref<InstanceType<typeof NoteContextMenu> | null>(null);
const folderContextMenu = ref<InstanceType<typeof FolderContextMenu> | null>(null);

function openContextMenu(event: MouseEvent) {
  let element = event.target as HTMLElement;
  let count = 0;
  while (count < 6 && element.parentElement && !element.classList.contains("p-treenode")) {
    element = element.parentElement;
    count += 1;
  }
  if (!element.classList.contains("p-treenode")) return;
  const nodeKey = element.children[0].children[2].children[0].getAttribute("data-node");
  if (!nodeKey) return;
  const note = notes.value.find((n) => n.id === nodeKey);
  const folder = folders.value.find((f) => f.id === nodeKey);
  if (note) {
    contextNote.value = note ?? null;
    noteContextMenu.value?.openMenu(event);
  } else if (folder) {
    contextFolder.value = folder ?? null;
    folderContextMenu.value?.openMenu(event);
  }
}
</script>

<template>
  <div v-on-click-outside="() => (selectedKey = null)" class="tree-container">
    <ConfirmDialog :draggable="false" />
    <NotesTreeButtons />
    <div class="scroll-container">
      <div v-if="notes.length === 0 && folders.length === 0" class="no-notes">
        <i class="ti ti-files"></i>
        <span>No notes found</span>
      </div>
      <ScrollPanel>
        <NotesTree :node-refs-fn="(key, el) => (nodeRefs[key] = el)" @contextmenu="openContextMenu" />
      </ScrollPanel>
    </div>
    <NoteContextMenu ref="noteContextMenu" :note="contextNote" @rename="(id) => nodeRefs[id]?.enableRename()" />
    <FolderContextMenu ref="folderContextMenu" :folder="contextFolder" @rename="(id) => nodeRefs[id]?.enableRename()" />
  </div>
</template>

<style scoped lang="scss">
.tree-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.scroll-container {
  flex: 1;
  overflow: hidden;
}
.p-scrollpanel {
  height: 100%;
  max-height: 100%;
  margin-right: 6px;
  :deep(.p-scrollpanel-bar) {
    background-color: var(--bluegray-200);
    border-radius: 10px;
    width: 8px;
  }
}
.no-notes {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  i {
    font-size: 6rem;
    color: var(--bluegray-100);
  }
  span {
    font-size: 1.8rem;
    font-weight: 400;
    margin-top: 1rem;
    color: var(--bluegray-200);
  }
}
</style>
