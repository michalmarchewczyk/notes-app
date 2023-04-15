<script setup lang="ts"></script>

<template>
  <div class="footer-container">
    <div class="footer">
      <div class="flex flex-column">
        <img src="~assets/logo.svg" alt="" />
        <div class="flex-1"></div>
        <span>Created by</span>
        <a href="https://github.com/michalmarchewczyk" target="_blank" class="font-bold mt-1">Michał Marchewczyk</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer-container {
  position: relative;
  display: block;
  width: 100%;
  background-color: #ffffff;
  border-top: 1px solid #ddd;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.06);
  z-index: 100;
  height: 460px;
  .footer {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: 40px 30px 80px;

    a {
      color: var(--text-color);
    }
    img {
      width: 160px;
    }
  }
}
</style>
