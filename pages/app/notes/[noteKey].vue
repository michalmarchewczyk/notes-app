<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <div>NOTE: {{ route.params.noteKey }}</div>
</template>

<style scoped lang="scss"></style>
