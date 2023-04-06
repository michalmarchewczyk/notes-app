<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "app",
});
</script>

<template>
  <div class="h-full">
    <Splitter>
      <SplitterPanel :min-size="10" :size="15" class="menu">
        <UserMenu />
      </SplitterPanel>
      <SplitterPanel :min-size="70" :size="85" class="page">
        <NuxtPage />
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<style scoped lang="scss">
.menu {
  min-width: 180px;
}
.page {
  box-shadow: inset 40px 0 20px -40px rgba(0, 0, 0, 0.1);
  background-color: hsl(200, 40%, 98%);
}
.p-splitter {
  height: 100%;
  border-radius: 0;
  :deep(.p-splitter-panel) {
    flex-grow: 0;
    overflow: hidden;
  }
  :deep(.p-splitter-gutter) {
    width: 1.5px;
    background-color: var(--bluegray-200);
    &.p-splitter-gutter-resizing {
      background-color: var(--bluegray-300);
    }
    z-index: 1000;
    .p-splitter-gutter-handle {
      background-color: var(--bluegray-300);
      width: 3px !important;
      flex-shrink: 0;
      height: 40px;
      border-radius: 2px;
      &:focus {
        box-shadow: none;
      }
    }
  }
}
</style>
