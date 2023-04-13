<script setup lang="ts">
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { TreeNode } from "primevue/tree";
import { vOnClickOutside } from "@vueuse/components";
import NoteData from "~/utils/NoteData";
import FolderData from "~/utils/FolderData";

const user = useCurrentUser();
const db = useFirestore();
const foldersRef = collection(db, "folders");
const notesRef = collection(db, "notes");

const folders = useSharedFolders();
const notes = useSharedNotes();

const sortMethod = ref("title-asc");

const sortMethods: Record<
  string,
  (a: TreeNode & { data: NoteData | FolderData }, b: TreeNode & { data: NoteData | FolderData }) => number
> = {
  "title-asc": (a, b) => a.data.title.localeCompare(b.data.title),
  "title-desc": (a, b) => b.data.title.localeCompare(a.data.title),
  "created-asc": (a, b) => a.data.created - b.data.created,
  "created-desc": (a, b) => b.data.created - a.data.created,
};

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
    ref: doc("parent" in data ? foldersRef : notesRef, data.id),
    children: [],
  } as TreeNode & { data: NoteData | FolderData };
}

const noteNodes = computed(() => {
  return notes.value.map((note) => getNode(note));
});

const tree = computed(() => {
  const nNodes = notes.value.map((note) => getNode(note));
  const fNodes = folders.value.map((folder) => getNode(folder));
  fNodes.forEach((folderNode) => {
    const childrenNotes = nNodes.filter((noteNode) => noteNode.parent === folderNode.key);
    const childrenFolders = fNodes.filter((fNode) => fNode.parent === folderNode.key);
    folderNode.children = [...childrenFolders, ...childrenNotes].sort(sortMethods[sortMethod.value]);
  });
  return [
    ...[...fNodes].filter((folderNode) => folderNode.parent === null),
    ...[...nNodes].filter((noteNode) => noteNode.parent === null),
  ].sort(sortMethods[sortMethod.value]);
});

const selectedKey = ref<Record<string, boolean> | null>(null);
const expandedKeys = ref<Record<string, boolean>>({});

const nodeRefs = ref<Record<string, HTMLDivElement>>({});
function handleRef(el: HTMLDivElement, key: string) {
  if (el) {
    nodeRefs.value[key] = el;
  }
}

async function addNote() {
  let parent = Object.keys(selectedKey.value ?? {})[0] ?? null;
  if (parent && !!noteNodes.value.find((note) => note.key === parent)) {
    parent = noteNodes.value.find((note) => note.key === parent)?.parent ?? null;
  }
  const doc = await addDoc(notesRef, {
    owner: user.value?.uid,
    title: "New Note",
    created: serverTimestamp(),
    folder: parent,
  } as Omit<NoteData, "id">);
  selectedKey.value = { [doc.id]: true };
  if (parent && expandedKeys.value) {
    expandedKeys.value[parent] = true;
  }
  nodeRefs.value[doc.id]?.scrollIntoView({ block: "end" });
  openNode({ key: doc.id, type: "note" });
}
async function addFolder() {
  let parent = Object.keys(selectedKey.value ?? {})[0] ?? null;
  if (parent && !!noteNodes.value.find((note) => note.key === parent)) {
    parent = noteNodes.value.find((note) => note.key === parent)?.parent ?? null;
  }
  const doc = await addDoc(foldersRef, {
    owner: user.value?.uid,
    title: "New Folder",
    created: serverTimestamp(),
    parent,
  } as Omit<FolderData, "id">);
  selectedKey.value = { [doc.id]: true };
  if (parent && expandedKeys.value) {
    expandedKeys.value[parent] = true;
  }
  nodeRefs.value[doc.id]?.scrollIntoView({ block: "end" });
}

function unselect() {
  selectedKey.value = {};
}

function openNode(node: TreeNode) {
  if (node.type === "note") {
    navigateTo(`/app/notes/${node.key}`);
  }
}
</script>

<template>
  <div v-on-click-outside="unselect" class="tree-container">
    <div class="buttons-container">
      <NotesTreeSortMenu v-model:sort-method="sortMethod" />
      <div class="flex-1" />
      <Button icon="ti ti-folder-plus" text @click="addFolder()" />
      <Button icon="ti ti-file-plus" text @click="addNote()" />
    </div>
    <div class="scroll-container">
      <div v-if="tree.length === 0" class="no-notes">
        <i class="ti ti-files"></i>
        <span>No notes found</span>
      </div>
      <ScrollPanel>
        <Tree
          v-model:selection-keys="selectedKey"
          v-model:expanded-keys="expandedKeys"
          :value="tree"
          selection-mode="single"
          @node-select="openNode"
        >
          <template #default="slotProps">
            <div :ref="(el) => handleRef(el, slotProps.node.key)">
              <NotesTreeNode :node="slotProps.node" />
            </div>
          </template>
        </Tree>
      </ScrollPanel>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tree-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.buttons-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0.5rem 0.5rem;
  gap: 0.3rem;
  span {
    i {
      font-size: 1.3rem;
      margin-top: -0.65rem;
    }
    input {
      width: 100%;
    }
  }
  button {
    height: 3rem;
    :deep(.ti) {
      font-size: 1.5rem;
    }
  }
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
