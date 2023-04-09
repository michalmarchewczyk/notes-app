<script setup lang="ts">
const userData = useUserData();

watch(
  () => userData.data.value,
  () => {
    if (userData.data.value?.lastOpened && userData.data.value?.lastOpened.length > 0) {
      navigateTo("/app/notes/" + userData.data.value?.lastOpened[userData.data.value?.lastOpened.length - 1]);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>NOTES INDEX</div>
</template>

<style scoped lang="scss"></style>
