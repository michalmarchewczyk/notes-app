<script setup lang="ts">
import { updateCurrentUserProfile } from "vuefire";

const user = useCurrentUser();

const username = ref("");

watch(
  () => !!user.value?.displayName,
  () => {
    if (!username.value) {
      username.value = user.value?.displayName ?? "";
    }
  },
  { immediate: true }
);

watchDebounced(
  username,
  () => {
    updateCurrentUserProfile({ displayName: username.value });
  },
  { debounce: 500, maxWait: 1000 }
);
</script>

<template>
  <div class="setting">
    <div>
      <h2>Username</h2>
      <span> Set profile username </span>
    </div>
    <InputText v-model="username" placeholder="Username" />
  </div>
</template>

<style scoped lang="scss"></style>
