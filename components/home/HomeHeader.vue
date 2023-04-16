<script setup lang="ts"></script>

<template>
  <header>
    <h1>Best notes app.</h1>
    <NuxtLink to="/signup">
      <Button rounded label="Get started" icon="ti ti-chevron-right" size="large" icon-pos="right" />
    </NuxtLink>
    <div class="preview">
      <img src="~assets/background.png" alt="" />
      <img src="~assets/screenshot.png" alt="" />
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 60px;
    margin-bottom: 60px;
  }
  button {
    z-index: 1;
  }
}
.preview {
  margin-top: 160px;
  margin-bottom: 160px;
  position: relative;
  width: 80%;
  aspect-ratio: 16/8.6;
  //background-color: #f0f0f0;
  border-radius: 16px;
  //border: 2px solid #ddd;
  img:first-child {
    display: block;
    position: absolute;
    --left: 27.5%;
    width: calc(100% + var(--left) * 2);
    left: calc(var(--left) * -1);
    --top: 44.5%;
    height: calc(100% + var(--top) * 2);
    top: calc(var(--top) * -1);
    opacity: 0.7;
    z-index: 0;
  }
  img:nth-child(2) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    border: 2px solid #f5f5f5;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
