<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "app",
});

const user = useCurrentUser();
</script>

<template>
  <div>
    <h1>App</h1>
    <h2>User: {{ user?.displayName || user?.email }}</h2>
  </div>
</template>

<style scoped lang="scss"></style>
