<template>
  <div class="container">
    <NuxtLink to="/"> <img src="~assets/logo.svg" alt="" /></NuxtLink>
    <div class="flex flex-column justify-content-center align-items-center h-screen">
      <slot></slot>
    </div>
    <img src="~assets/background2.png" alt="" />
  </div>
</template>

<style scoped lang="scss">
a {
  position: fixed;
  top: 20px;
  left: 20px;
  height: 60px;
  img {
    height: 100%;
  }
  z-index: 100;
}
.container {
  background: #ffffff;
  div {
    position: relative;
    z-index: 1;
  }
  > img {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 80%;
    height: 100%;
    object-position: bottom left;
    object-fit: cover;
    z-index: 0;
    opacity: 0.6;
    @media (max-width: 800px) {
      width: 100%;
      object-position: bottom center;
    }
  }
}
</style>
