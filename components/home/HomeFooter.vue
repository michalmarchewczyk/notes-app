<script setup lang="ts"></script>

<template>
  <div class="footer-container">
    <div class="footer">
      <div class="flex flex-column">
        <img src="~assets/logo.svg" alt="" />
        <div class="flex-1"></div>
        <span>Created by</span>
        <a href="https://github.com/michalmarchewczyk" target="_blank" class="font-bold">Michał Marchewczyk</a>
      </div>
      <div class="flex-1"></div>
      <div>
        <span>Technologies</span>
        <a href="https://vuejs.org/" target="_blank">Vue.js 3</a>
        <a href="https://nuxt.com/" target="_blank">Nuxt 3</a>
        <a href="https://primevue.org/" target="_blank">PrimeVue</a>
        <a href="https://firebase.google.com/" target="_blank">Firebase</a>
        <a href="https://vuefire.vuejs.org/" target="_blank">VueFire</a>
        <a href="https://tabler-icons.io/" target="_blank">Tabler Icons</a>
        <a href="https://vueuse.org/" target="_blank">VueUse</a>
      </div>
      <div>
        <span>Links</span>
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="https://github.com/michalmarchewczyk/notes-app" target="_blank">Source code</a>
        <a href="https://github.com/michalmarchewczyk/notes-app/blob/master/LICENSE" target="_blank">License</a>
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
  min-height: 360px;
  .footer {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: 40px 30px 80px;
    gap: 80px;
    flex-wrap: wrap;
    a {
      color: var(--text-color);
    }
    img {
      width: 160px;
    }
    > div {
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 160px;
      > span:first-child {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 20px;
      }
      a {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
