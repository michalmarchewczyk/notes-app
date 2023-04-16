<script setup lang="ts">
const userData = useSharedUserData();

const theme = computed(() => userData.data.value?.theme ?? "light");
</script>

<template>
  <div class="h-screen" :data-theme="theme">
    <slot></slot>
  </div>
</template>
