<script setup lang="ts">
import { addDoc, collection, doc, query, serverTimestamp, where, orderBy } from "firebase/firestore";
import { TreeNode } from "primevue/tree";
import NoteData from "~/utils/NoteData";
import FolderData from "~/utils/FolderData";
import NotesTreeNode from "~/components/NotesTreeNode.vue";

const user = useCurrentUser();
const db = useFirestore();
const foldersRef = collection(db, "folders");
const notesRef = collection(db, "notes");

const foldersQuery = query(foldersRef, where("owner", "==", user.value!.uid), orderBy("created", "asc"));
const notesQuery = query(notesRef, where("owner", "==", user.value!.uid), orderBy("created", "asc"));

const folders = useCollection<FolderData>(foldersQuery);
const notes = useCollection<NoteData>(notesQuery);

function getNode(data: NoteData | FolderData) {
  return {
    key: data.id,
    label: data.title,
    icon: "ti " + ("parent" in data ? "ti-folder" : "ti-file"),
    collapsedIcon: "ti ti-chevron-right",
    expandedIcon: "ti ti-chevron-down",
    type: "note",
    parent: "parent" in data ? data.parent : data.folder,
    note: data,
    ref: doc("parent" in data ? foldersRef : notesRef, data.id),
    children: [],
  } as TreeNode;
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
    folderNode.children = [...childrenFolders, ...childrenNotes];
  });
  return [
    ...[...fNodes].filter((folderNode) => folderNode.parent === null),
    ...[...nNodes].filter((noteNode) => noteNode.parent === null),
  ];
});

const selectedKey = ref<Record<string, boolean> | null>(null);
const expandedKeys = ref<Record<string, boolean>>({});

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
}

const search = ref("");
</script>

<template>
  <div class="tree-container">
    <div class="buttons-container">
      <span class="p-input-icon-left flex-1">
        <i class="ti ti-search" />
        <InputText v-model="search" placeholder="Search" />
      </span>
      <Button icon="ti ti-folder-plus" text @click="addFolder()" />
      <Button icon="ti ti-file-plus" text @click="addNote()" />
    </div>
    <div class="scroll-container">
      <ScrollPanel>
        <Tree
          v-model:selection-keys="selectedKey"
          v-model:expanded-keys="expandedKeys"
          :value="tree"
          selection-mode="single"
        >
          <template #default="slotProps">
            <NotesTreeNode :node="slotProps.node" />
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
  padding: 0.3rem 0.5rem;
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
    :deep(.ti) {
      font-size: 1.3rem;
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
    align-self: stretch;
    flex: 1;
    overflow: hidden;
  }
}
</style>
