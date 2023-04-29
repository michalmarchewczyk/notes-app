<script setup lang="ts">
const userData = useSharedUserData();

const editorLineNumbers = computed(() => !!userData.data.value?.editorLineNumbers);

function switchEditorLineNumbers(value: boolean) {
  userData.update({ editorLineNumbers: value });
}
</script>

<template>
  <div class="setting">
    <div>
      <h2>Line numbers</h2>
      <span> Display line numbers in note editor </span>
    </div>
    <InputSwitch :model-value="editorLineNumbers" @update:model-value="switchEditorLineNumbers" />
  </div>
</template>

<style scoped lang="scss"></style>
