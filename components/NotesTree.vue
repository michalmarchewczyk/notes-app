<script setup lang="ts">
import { TreeNode } from "primevue/tree";
import NoteData from "~/utils/NoteData";
import FolderData from "~/utils/FolderData";
import NotesTreeNode from "~/components/NotesTreeNode.vue";

const selectedKeyState = useState<string | null>("selectedKey", () => null);
const selectedSortMethod = useState<string>("selectedSortMethod", () => "created-desc");
const props = defineProps<{
  nodeRefsFn: (key: string, el: InstanceType<typeof NotesTreeNode>) => void;
}>();
const emit = defineEmits<{
  (event: "contextmenu", e: MouseEvent): void;
}>();

const { notes, updateNoteParent } = useSharedNotes();
const { folders, updateFolderParent } = useSharedFolders();

const selectedKey = computed<Record<string, boolean>>({
  get: () => (selectedKeyState.value ? { [selectedKeyState.value]: true } : {}),
  set: (v) => (selectedKeyState.value = Object.keys(v ?? {})[0] ?? null),
});
const expandedKeys = ref<Record<string, boolean>>({});

type TreeNodeWithData = Omit<TreeNode, "data"> & { data: NoteData | FolderData };

function getNode(data: NoteData | FolderData) {
  return {
    key: data.id,
    label: data.title,
    icon: "ti " + ("parent" in data ? "ti-folder-filled" : "ti-file"),
    collapsedIcon: "ti ti-chevron-right",
    expandedIcon: "ti ti-chevron-down",
    type: "parent" in data ? "folder" : "note",
    styleClass: "parent" in data ? "folder-node" : "note-node",
    parent: "parent" in data ? data.parent : data.folder,
    data,
    children: [],
  } as TreeNodeWithData;
}

const sortMethods: Record<string, (a: TreeNodeWithData, b: TreeNodeWithData) => number> = {
  "title-asc": (a, b) => a.data.title.localeCompare(b.data.title),
  "title-desc": (a, b) => b.data.title.localeCompare(a.data.title),
  "created-asc": (a, b) => a.data.created.seconds - b.data.created.seconds,
  "created-desc": (a, b) => b.data.created.seconds - a.data.created.seconds,
};

const tree = computed(() => {
  const nNodes = notes.value.map((note) => getNode(note));
  const fNodes = folders.value.map((folder) => getNode(folder));
  fNodes.forEach((folderNode) => {
    const childrenNotes = nNodes.filter((noteNode) => noteNode.parent === folderNode.key);
    const childrenFolders = fNodes.filter((fNode) => fNode.parent === folderNode.key);
    folderNode.children = [...childrenFolders, ...childrenNotes].sort(sortMethods[selectedSortMethod.value]);
  });
  return [
    ...[...fNodes].filter((folderNode) => folderNode.parent === null),
    ...[...nNodes].filter((noteNode) => noteNode.parent === null),
  ].sort(sortMethods[selectedSortMethod.value]);
});

const nodeElementRefs = ref<Record<string, HTMLDivElement | null>>({});

function addNode(id: string, parent: string | null) {
  selectedKey.value = { [id]: true };
  if (parent && expandedKeys.value) {
    expandedKeys.value[parent] = true;
  }
  nodeElementRefs.value[id]?.scrollIntoView({ block: "end" });
}
function deleteNode(id: string) {
  if (selectedKey.value && selectedKey.value[id]) {
    selectedKey.value = {};
  }
}

watchArray(
  notes,
  (_, __, added, removed) => {
    if (added.length > 2) {
      return;
    }
    if (added[0] && !removed[0]) {
      addNode(added[0].id, added[0].folder);
      openNode({ key: added[0].id, type: "note" });
    }
    if (!added[0] && removed[0]) {
      deleteNode(removed[0].id);
    }
  },
  { deep: true }
);

watchArray(
  folders,
  (_, __, added, removed) => {
    if (added.length > 2) {
      return;
    }
    if (added[0] && !removed[0]) {
      addNode(added[0].id, added[0].parent);
    }
    if (!added[0] && removed[0]) {
      deleteNode(removed[0].id);
    }
  },
  { deep: true }
);

function openNode(node: TreeNode) {
  if (node.type === "note") {
    navigateTo(`/app/notes/${node.key}`);
  }
}

async function refNode(key: string, el: HTMLDivElement | null) {
  nodeElementRefs.value[key] = el;
  await nextTick();
  const node = el?.parentElement?.parentElement?.parentElement;
  if (node) {
    node.draggable = true;
    node.ondragstart = onDragStart;
  }
}

function onDragStart(event: DragEvent) {
  const element = event.target as HTMLElement;
  const nodeKey = element.querySelector(".p-treenode-label > div")?.getAttribute("data-node");
  if (nodeKey) {
    event.dataTransfer?.setData("text/plain", nodeKey);
  }
}

function onDrop(e: any) {
  const nodeKey = currentDropTarget.value?.querySelector(".p-treenode-label > div")?.getAttribute("data-node");
  let folder: { id: string | null } | undefined = folders.value.find((f) => f.id === nodeKey);
  if (currentDropTarget.value?.classList.contains("p-tree")) {
    folder = { id: null };
  }
  if (!folder) {
    return;
  }
  const key = e.dataTransfer.getData("text/plain");
  const noteToMove = notes.value.find((n) => n.id === key);
  const folderToMove = folders.value.find((f) => f.id === key);
  if (noteToMove) {
    updateNoteParent(noteToMove.id, folder.id);
  } else if (folderToMove && folderToMove.id !== folder.id) {
    updateFolderParent(folderToMove.id, folder.id);
  }
  currentDropTarget.value = null;
}

const currentDropTarget = ref<HTMLElement | null>(null);

function onDragOver(event: MouseEvent) {
  let element = event.target as HTMLElement;
  let count = 0;
  while (
    count < 6 &&
    element.parentElement &&
    !element.classList.contains("p-treenode") &&
    !element.classList.contains("p-tree")
  ) {
    element = element.parentElement;
    count += 1;
  }
  if (element.classList.contains("p-treenode") && element.children[0]?.classList.contains("folder-node")) {
    currentDropTarget.value = element;
  } else if (
    element.classList.contains("p-treenode") &&
    element.children[0]?.classList.contains("note-node") &&
    element.parentElement?.parentElement?.classList.contains("p-treenode")
  ) {
    currentDropTarget.value = element.parentElement?.parentElement ?? null;
  } else if (
    element.classList.contains("p-treenode") &&
    element.children[0]?.classList.contains("note-node") &&
    element.parentElement?.parentElement?.parentElement?.classList.contains("p-tree")
  ) {
    currentDropTarget.value = element.parentElement?.parentElement?.parentElement ?? null;
  } else if (element.classList.contains("p-tree")) {
    currentDropTarget.value = element;
  } else {
    currentDropTarget.value = null;
  }
}

watch(
  currentDropTarget,
  (newEl, prevEl) => {
    prevEl?.classList.remove("drop-active");
    newEl?.classList.add("drop-active");
  },
  { immediate: true }
);
</script>

<template>
  <Tree
    v-model:selection-keys="selectedKey"
    v-model:expanded-keys="expandedKeys"
    :value="tree"
    selection-mode="single"
    @node-select="openNode"
    @contextmenu="(e) => emit('contextmenu', e)"
    @drop="onDrop"
    @dragover.prevent="onDragOver"
    @dragenter.prevent
    @dragend.prevent="currentDropTarget = null"
  >
    <template #default="slotProps">
      <div :ref="(el) => refNode(slotProps.node.key, el)" :data-node="slotProps.node.key">
        <NotesTreeNode :ref="(el) => props.nodeRefsFn(slotProps.node.key, el)" :node="slotProps.node" />
      </div>
    </template>
  </Tree>
</template>

<style scoped lang="scss">
.p-tree {
  border: none;
  padding: 0;
  margin: 4px;
  min-height: calc(100% - 8px);
  &.drop-active {
    margin: 2px;
    border: 2px dashed var(--surface-400);
  }
  :deep(.p-tree-toggler) {
    margin-left: -0.2rem;
    margin-right: 0.2rem !important;
  }
  :deep(.p-treenode) {
    padding: 2px !important;
    border-radius: 6px;
  }
  :deep(.p-treenode.drop-active) {
    padding: 0 !important;
    border: 2px dashed var(--surface-400);
  }
  :deep(.p-treenode-content) {
    padding-top: 0.3rem !important;
    padding-bottom: 0.3rem !important;
  }
  :deep(.p-treenode-label) {
    flex: 1;
    overflow: hidden;
  }
}
</style>
