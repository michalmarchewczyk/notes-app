<script setup lang="ts">
import { TreeNode } from "primevue/tree";
import { vOnClickOutside } from "@vueuse/components";
import InputText from "primevue/inputtext";
import { setDoc } from "@firebase/firestore";

const props = defineProps<{
  node: TreeNode;
}>();

const rename = ref(false);
const renameValue = ref<string>("");
const inputRef = ref<{ $el: HTMLInputElement } | null>(null);

async function enableRename() {
  rename.value = true;
  renameValue.value = props.node.label ?? "";
  await nextTick();
  inputRef.value?.$el.focus();
  inputRef.value?.$el.select();
}
async function disableRename() {
  rename.value = false;
  if (props.node.label !== renameValue.value && renameValue.value !== "") {
    await setDoc(props.node.ref, { title: renameValue.value }, { merge: true });
  }
}
</script>

<template>
  <div v-on-click-outside="disableRename" class="node" @dblclick="enableRename">
    <InputText v-if="rename" ref="inputRef" v-model="renameValue" @keydown.stop />
    <span v-else>{{ props.node.label }}</span>
  </div>
</template>

<style scoped lang="scss">
.node {
  height: 100%;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  input {
    width: 100%;
    height: 32px;
    margin: 0.2rem;
  }
  span {
    width: 100%;
    max-width: 100%;
    padding-left: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
  }
}
</style>
