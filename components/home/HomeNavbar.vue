<script setup lang="ts">
const user = useCurrentUser();
</script>

<template>
  <div class="navbar">
    <div class="container">
      <NuxtLink to="/">
        <img src="~assets/logo.svg" alt="" />
      </NuxtLink>
      <div class="flex-1"></div>
      <NuxtLink v-if="!user" to="/login">
        <Button v-if="!user" rounded outlined label="Login" icon="ti ti-login" />
      </NuxtLink>
      <NuxtLink v-if="!user" to="/signup">
        <Button v-if="!user" rounded label="Create account" icon="ti ti-user-plus" />
      </NuxtLink>
      <span v-if="user">{{ user.displayName }}</span>
      <NuxtLink v-if="user" to="/app">
        <Button v-if="user" rounded label="Open" icon="ti ti-external-link" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  position: sticky;
  top: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px) saturate(1.5);
  height: 80px;
  z-index: 100;
  border-bottom: 1px solid #eaeaea;
  .container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    gap: 20px;
    padding-left: 30px;
    padding-right: 30px;
    a {
      img {
        height: 50px;
      }
      height: 50px;
    }
    span {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }
}
</style>
