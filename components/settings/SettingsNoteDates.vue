<script setup lang="ts">
const userData = useSharedUserData();

const noteDates = computed(() => !!userData.data.value?.noteDates);

function switchNoteDates(value: boolean) {
  userData.update({ noteDates: value });
}
</script>

<template>
  <div class="setting">
    <div>
      <h2>Note Dates</h2>
      <span> Show notes creation date and time </span>
    </div>
    <InputSwitch :model-value="noteDates" @update:model-value="switchNoteDates" />
  </div>
</template>

<style scoped lang="scss"></style>
