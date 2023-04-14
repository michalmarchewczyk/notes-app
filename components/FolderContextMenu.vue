<script setup lang="ts">
import ContextMenu from "primevue/contextmenu";
import { MenuItem } from "primevue/menuitem";
import FolderData from "~/utils/FolderData";

const props = defineProps<{
  folder: FolderData;
}>();

const menu = ref<ContextMenu | null>(null);

function openMenu(event: MouseEvent) {
  menu.value?.show(event);
}
function closeMenu() {
  menu.value?.hide();
}

defineExpose({
  openMenu,
  closeMenu,
});

const emit = defineEmits<{
  (event: "rename", id: string): void;
  (event: "delete", id: string): void;
}>();

const items = computed<MenuItem[]>(() => [
  {
    label: "Rename",
    icon: "ti ti-edit",
    command: () => emit("rename", props.folder?.id),
  },
  {
    label: "Delete",
    icon: "ti ti-trash",
    command: () => emit("delete", props.folder?.id),
  },
]);
</script>

<template>
  <ContextMenu ref="menu" :model="items"></ContextMenu>
</template>

<style scoped lang="scss"></style>