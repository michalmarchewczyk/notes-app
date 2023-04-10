<script setup lang="ts">
import { updateCurrentUserProfile } from "vuefire";

const user = useCurrentUser();

const userData = useUserData();

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

const theme = computed(() => userData.data.value?.theme ?? "light");

function switchTheme({ value }: { value: string }) {
  if (!value) return;
  userData.update({ theme: value.toLowerCase() });
}

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
      <div class="setting">
        <div>
          <h2>Theme</h2>
          <span> Color theme that will be applied to the interface. </span>
        </div>
        <SelectButton
          :model-value="theme === 'dark' ? 'Dark' : 'Light'"
          :options="['Light', 'Dark']"
          @change="switchTheme"
        />
      </div>
      <Divider />
      <div class="setting">
        <div>
          <h2>Username</h2>
          <span> Set profile username {{ username }} </span>
        </div>
        <InputText v-model="username" placeholder="Username" />
      </div>
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
    background-color: var(--bluegray-200);
    border-radius: 10px;
    width: 10px;
  }
}
.container {
  color: var(--text-color);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 2rem 4rem;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    button {
      :deep(span) {
        &::before {
          font-size: 26px;
        }
      }
    }
  }
}
.setting {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 4px;
  h2 {
    font-size: 1.5rem;
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
