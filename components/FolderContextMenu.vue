<script setup lang="ts">
import ContextMenu from "primevue/contextmenu";
import { MenuItem } from "primevue/menuitem";
import FolderData from "~/utils/FolderData";

const props = defineProps<{
  folder: FolderData;
}>();

const menu = ref<ContextMenu | null>(null);
const instanceLastOpened = ref<number>(0);
const sharedLastOpened = useState<number>("contextMenu", () => Date.now());

watch(sharedLastOpened, () => {
  if (instanceLastOpened.value !== sharedLastOpened.value) {
    closeMenu();
  }
});

function openMenu(event: MouseEvent) {
  instanceLastOpened.value = Date.now();
  sharedLastOpened.value = Date.now();
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
}>();

const { deleteFolder, addFolder, deleteFolderRecursive } = useSharedFolders();
const { addNote } = useSharedNotes();

const items = computed<MenuItem[]>(() => [
  {
    separator: true,
  },
  {
    label: "Add note",
    icon: "ti ti-file-plus",
    command: () => addNote(props.folder?.id),
  },
  {
    label: "Add folder",
    icon: "ti ti-folder-plus",
    command: () => addFolder(props.folder?.id),
  },
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
    command: () => {
      deleteFolder(props.folder?.id);
    },
  },
  {
    label: "Delete with contents",
    icon: "ti ti-trash-x",
    command: () => {
      deleteFolderRecursive(props.folder?.id);
    },
  },
]);
</script>

<template>
  <ContextMenu
    ref="menu"
    :model="items"
    :global="true"
    class="folder-contextmenu"
    :data-title="props.folder?.title"
  ></ContextMenu>
</template>

<style scoped lang="scss">
:global(.folder-contextmenu) {
  width: 230px;
  overflow: hidden;
}
:global(.folder-contextmenu::before) {
  content: attr(data-title);
  display: block;
  position: relative;
  padding: 6px 20px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
