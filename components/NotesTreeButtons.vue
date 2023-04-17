<script setup lang="ts">
const props = defineProps<{
  selectedKey: string | null;
  sortMethod: "title-asc" | "title-desc" | "created-asc" | "created-desc";
}>();
const emit = defineEmits<{
  (event: "update:sortMethod", value: "title-asc" | "title-desc" | "created-asc" | "created-desc"): void;
}>();

const { addFolder } = useSharedFolders();
const { addNote } = useSharedNotes();
</script>

<template>
  <div class="buttons-container">
    <NotesTreeSortMenu :sort-method="props.sortMethod" @update:sort-method="(v) => emit('update:sortMethod', v)" />
    <div class="flex-1" />
    <Button icon="ti ti-folder-plus" text @click="() => addFolder(props.selectedKey)" />
    <Button icon="ti ti-file-plus" text @click="() => addNote(props.selectedKey)" />
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
