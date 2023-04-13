<script setup lang="ts">
onMounted(() => {
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
});
</script>

<template>
  <div class="container">
    <i class="ti ti-file"></i>
    <span>Open note to start editing</span>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 2rem;
  opacity: 0.5;
  i {
    font-size: 5rem;
  }
  span {
    font-size: 1.6rem;
    font-weight: 600;
  }
}
</style>
