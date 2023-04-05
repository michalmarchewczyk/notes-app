<script setup lang="ts">
const auth = useFirebaseAuth();

async function logout() {
  await auth?.signOut();
  navigateTo("/");
}
</script>

<template>
  <div>
    <h1>App layout</h1>
    <button @click="logout">Logout</button>
    <slot></slot>
  </div>
</template>
