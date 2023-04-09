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
        <ClientOnly>
          <NotesTree />
        </ClientOnly>
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
  min-width: 220px;
  display: flex;
  flex-direction: column;
}
.page {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    box-shadow: inset 40px 0 20px -40px rgba(0, 0, 0, 0.1);
    z-index: 1;
    pointer-events: none;
  }
  background-color: hsl(200, 40%, 97%);
}
.p-splitter {
  height: 100%;
  border-radius: 0;
  border: none;
  :deep(.p-splitter-panel) {
    //flex-grow: 0;
    overflow: hidden;
  }
  :deep(.p-splitter-gutter) {
    width: 2px;
    background-color: var(--bluegray-200);
    &.p-splitter-gutter-resizing {
      background-color: var(--bluegray-300);
    }
    z-index: 1000;
    .p-splitter-gutter-handle {
      background-color: var(--bluegray-300);
      width: 4px !important;
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
