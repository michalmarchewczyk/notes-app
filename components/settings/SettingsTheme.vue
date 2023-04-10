<script setup lang="ts">
const userData = useUserData();

const theme = computed(() => userData.data.value?.theme ?? "light");

function switchTheme({ value }: { value: string }) {
  if (!value) return;
  userData.update({ theme: value.toLowerCase() });
}
</script>

<template>
  <div class="setting">
    <div>
      <h2>Theme</h2>
      <span> Color theme that will be applied to the interface </span>
    </div>
    <SelectButton
      :model-value="theme === 'dark' ? 'Dark' : 'Light'"
      :options="['Light', 'Dark']"
      @change="switchTheme"
    />
  </div>
</template>

<style scoped lang="scss"></style>
