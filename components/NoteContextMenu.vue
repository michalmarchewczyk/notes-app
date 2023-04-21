<script setup lang="ts">
import ContextMenu from "primevue/contextmenu";
import { MenuItem } from "primevue/menuitem";
import NoteData from "~/utils/NoteData";

const props = defineProps<{
  note: NoteData;
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

const { deleteNote } = useSharedNotes();

const items = computed<MenuItem[]>(() => [
  {
    separator: true,
  },
  {
    label: "Rename",
    icon: "ti ti-edit",
    command: () => emit("rename", props.note?.id),
  },
  {
    label: "Delete",
    icon: "ti ti-trash",
    command: () => {
      deleteNote(props.note?.id);
    },
  },
]);
</script>

<template>
  <ContextMenu
    ref="menu"
    :model="items"
    :global="true"
    class="note-contextmenu"
    :data-title="props.note?.title"
  ></ContextMenu>
</template>

<style scoped lang="scss">
:global(.note-contextmenu) {
  width: 230px;
  overflow: hidden;
}
:global(.note-contextmenu::before) {
  content: attr(data-title);
  display: block;
  position: relative;
  padding: 6px 20px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
