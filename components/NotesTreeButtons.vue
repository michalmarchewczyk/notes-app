<script setup lang="ts">
const selectedKey = useState<string | null>("selectedKey", () => null);

const { addFolder } = useSharedFolders();
const { addNote } = useSharedNotes();
</script>

<template>
  <div class="buttons-container">
    <NotesTreeSortMenu />
    <div class="flex-1" />
    <Button icon="ti ti-folder-plus" text @click="() => addFolder(selectedKey)" />
    <Button icon="ti ti-file-plus" text @click="() => addNote(selectedKey)" />
  </div>
</template>

<style scoped lang="scss">
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
</style>
