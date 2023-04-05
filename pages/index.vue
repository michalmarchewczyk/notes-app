<script setup lang="ts">
const user = useCurrentUser();
</script>

<template>
  <div>
    <NuxtLink to="/login">Login</NuxtLink>
    <h1>Index</h1>
    <p v-if="user">
      {{ user.displayName || user.email }}
    </p>
    <p v-else>Not logged in</p>
  </div>
</template>

<style scoped lang="scss"></style>
