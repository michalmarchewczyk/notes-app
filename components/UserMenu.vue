<script setup lang="ts">
import { MenuItem } from "primevue/menuitem";
import generateUserLabel from "~/utils/generateUserLabel";

const auth = useFirebaseAuth();

async function logout() {
  await auth?.signOut();
  navigateTo("/login");
}

const menuHidden = ref(true);

const items = ref<MenuItem[]>([
  {
    label: "Home",
    icon: "ti ti-home",
    command: () => {
      navigateTo("/app");
      menuHidden.value = true;
    },
  },
  {
    label: "Settings",
    icon: "ti ti-settings",
    command: () => {
      navigateTo("/app/settings");
      menuHidden.value = true;
    },
  },
  { separator: true },
  { label: "Logout", icon: "ti ti-logout", command: logout },
  { separator: true },
]);

const user = useCurrentUser();

const avatarLabel = computed(() => generateUserLabel(user.value));
const avatarColor = computed(() => createColorFromString(user.value?.email || "", 70, 70));
const avatarTextColor = computed(() => createColorFromString(user.value?.email || "", 70, 30));
</script>

<template>
  <div class="menu-container" :class="{ 'menu-hidden': menuHidden }">
    <Menu :model="items" class="w-full">
      <template #end>
        <button
          class="w-full p-link flex align-items-center p-2 pl-3 text-color border-noround"
          @click="menuHidden = !menuHidden"
        >
          <Avatar v-if="user?.photoURL" class="mr-2" shape="circle" :image="user?.photoURL" />
          <Avatar
            v-else
            :label="avatarLabel"
            class="mr-2"
            shape="circle"
            :style="{ background: avatarColor, color: avatarTextColor }"
          />
          <div class="flex flex-column align flex-1 overflow-hidden">
            <span class="font-bold text-overflow-ellipsis overflow-hidden white-space-nowrap">
              {{ user?.displayName || user?.email }}
            </span>
          </div>
          <div class="ti ti-chevron-down text-lg button-chevron" style=""></div>
        </button>
      </template>
    </Menu>
  </div>
</template>

<style scoped lang="scss">
:global(*[data-theme="dark"] .menu-container) {
  border-top: 2px solid var(--blue-900) !important;
}
.menu-container {
  overflow: hidden;
  transition: height 0.2s ease;
  height: 204px;
  border-top: 2px solid var(--bluegray-100);
  :deep(.p-menu) {
    border: none;
    border-radius: 0;
  }
  :deep(.p-menu-list) {
    margin-top: 0;
    transition: margin-top 0.2s ease;
  }
  .button-chevron {
    transition: transform 0.2s ease;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    &::before {
      font-size: 1.4rem;
    }
  }
}
.menu-hidden {
  height: 54px;
  :deep(.p-menu-list) {
    margin-top: -150px;
  }
  .button-chevron {
    transform: rotate(180deg);
  }
}
</style>
