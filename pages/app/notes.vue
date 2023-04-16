<script setup lang="ts"></script>

<template>
  <div class="container">
    <ClientOnly>
      <NotesTabs />
    </ClientOnly>
    <NuxtPage />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
