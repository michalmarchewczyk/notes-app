<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import InputText from "primevue/inputtext";

const props = defineProps<{
  note: string;
}>();
const emit = defineEmits<{
  (event: "closeTab"): void;
  (event: "contextmenu", e: MouseEvent): void;
}>();

const { notes, renameNote } = useSharedNotes();
const noteTitles = computed(() => {
  return notes.value.reduce((acc, note) => {
    acc[note.id] = note.title;
    return acc;
  }, {} as Record<string, string>);
});

const rename = ref(false);
const renameValue = ref<string>("");
const inputRef = ref<{ $el: HTMLInputElement } | null>(null);

async function enableRename() {
  console.log("enableRename", props.note);
  rename.value = true;
  renameValue.value = noteTitles.value[props.note] ?? "";
  await nextTick();
  inputRef.value?.$el.focus();
  inputRef.value?.$el.select();
}
async function disableRename() {
  rename.value = false;
  if (noteTitles.value[props.note] !== renameValue.value && renameValue.value !== "") {
    await renameNote(props.note, renameValue.value);
  }
}

defineExpose({
  enableRename,
});
</script>

<template>
  <div
    v-on-click-outside="disableRename"
    class="tab"
    @click.middle.prevent.stop="emit('closeTab')"
    @contextmenu="(e) => emit('contextmenu', e)"
  >
    <InputText
      v-if="rename"
      ref="inputRef"
      v-model="renameValue"
      @keydown.stop
      @keyup.enter="disableRename"
      @keyup.esc="disableRename"
    />
    <div v-else class="content">
      <span>{{ noteTitles[props.note] ?? "-" }}</span>
      <Button icon="ti ti-x" severity="secondary" text rounded @click.prevent.stop="emit('closeTab')" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab {
  max-width: 100%;

  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.7rem;
    padding: 0.9rem 1.2rem;
  }
  input {
    max-width: calc(100% - 1.2rem);
    width: calc(100% - 1.2rem);
    height: 32px;
    margin: 0.55rem 0.6rem;
  }
  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  button {
    height: 1.3rem !important;
    width: 1.3rem !important;
    padding: 0.2rem 0 !important;
  }
}
</style>
