<script setup lang="ts">
import { TreeNode } from "primevue/tree";
import NoteData from "~/utils/NoteData";
import FolderData from "~/utils/FolderData";
import NotesTreeNode from "~/components/NotesTreeNode.vue";

const selectedKeyState = useState<string | null>("selectedKey", () => null);
const selectedSortMethod = useState<string>("selectedSortMethod", () => "title-asc");
const props = defineProps<{
  nodeRefsFn: (key: string, el: InstanceType<typeof NotesTreeNode>) => void;
}>();
const emit = defineEmits<{
  (event: "contextmenu", e: MouseEvent): void;
}>();

const { notes } = useSharedNotes();
const { folders } = useSharedFolders();

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

const nodeElementRefs = ref<Record<string, HTMLDivElement>>({});

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
</script>

<template>
  <Tree
    v-model:selection-keys="selectedKey"
    v-model:expanded-keys="expandedKeys"
    :value="tree"
    selection-mode="single"
    @node-select="openNode"
    @contextmenu="(e) => emit('contextmenu', e)"
  >
    <template #default="slotProps">
      <div :ref="(el) => (nodeElementRefs[slotProps.node.key] = el)" :data-node="slotProps.node.key">
        <NotesTreeNode :ref="(el) => props.nodeRefsFn(slotProps.node.key, el)" :node="slotProps.node" />
      </div>
    </template>
  </Tree>
</template>

<style scoped lang="scss">
.p-tree {
  border: none;
  padding: 0.3rem;
  :deep(.p-tree-toggler) {
    margin-left: -0.2rem;
    margin-right: 0.2rem !important;
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
