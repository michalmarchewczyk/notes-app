<script setup lang="ts">
useHead({
  title: "Settings - Notes App",
});

function closeSettings() {
  navigateTo("/app");
}
</script>

<template>
  <ScrollPanel>
    <div class="container">
      <div class="header">
        <h1>Settings</h1>
        <Button icon="ti ti-x" size="large" text rounded severity="secondary" @click="closeSettings"></Button>
      </div>
      <SettingsTheme />
      <Divider />
      <SettingsUsername />
      <Divider />
      <SettingsProfilePhoto />
      <Divider />
      <SettingsNoteDates />
      <SettingsEditorLineNumbers />
    </div>
  </ScrollPanel>
</template>

<style scoped lang="scss">
.p-scrollpanel {
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 1032px;
  padding-left: 16px;
  padding-right: 16px;
  margin: 0 auto;
  :deep(.p-scrollpanel-bar-y) {
    background-color: var(--surface-400);
    border-radius: 10px;
    width: 10px;
  }
}
.container {
  color: var(--text-color);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 2rem 2rem 4rem;
  .p-divider {
    margin: 0.5rem 0;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    h1 {
      font-weight: 800;
    }
    button {
      :deep(span) {
        &::before {
          font-size: 26px;
        }
      }
    }
  }
}
:deep(.setting) {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 4px;
  h2 {
    font-size: 1.4rem;
    margin-bottom: 0.6rem;
    margin-top: 0;
  }
  span {
    font-size: 1.1rem;
    flex-shrink: 2;
  }
  :last-child {
    flex-shrink: 0;
  }
}
</style>
