<template>
  <div class="container">
    <HomeNavbar />
    <slot></slot>
    <HomeFooter />
  </div>
</template>

<script setup lang="ts"></script>
<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
