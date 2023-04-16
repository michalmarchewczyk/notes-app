<script setup lang="ts">
import ContextMenu from "primevue/contextmenu";
import { MenuItem } from "primevue/menuitem";
import FolderData from "~/utils/FolderData";

const props = defineProps<{
  folder: FolderData;
  appendTo?: string;
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
    separator: true,
  },
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
  <ContextMenu
    ref="menu"
    :model="items"
    :append-to="props.appendTo"
    class="folder-contextmenu"
    :data-title="props.folder?.title"
  ></ContextMenu>
</template>

<style scoped lang="scss">
:global(.folder-contextmenu::before) {
  content: attr(data-title);
  display: block;
  position: relative;
  padding: 6px 20px;
  font-weight: 600;
}
</style>
