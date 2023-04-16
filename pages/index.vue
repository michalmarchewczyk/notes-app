<script setup lang="ts">
useHead({
  title: "Notes App",
});
</script>

<template>
  <div class="container">
    <HomeHeader />
    <HomeFeatures />
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
