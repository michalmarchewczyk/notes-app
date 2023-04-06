<script setup lang="ts">
import { MenuItem } from "primevue/menuitem";
import generateUserLabel from "~/utils/generateUserLabel";

const auth = useFirebaseAuth();

async function logout() {
  await auth?.signOut();
  navigateTo("/login");
}

const items = ref<MenuItem[]>([
  { separator: true },
  { label: "Home", icon: "pi pi-home", command: () => navigateTo("/app") },
  { label: "Settings", icon: "pi pi-cog", command: () => navigateTo("/app/settings") },
  { separator: true },
  { label: "Logout", icon: "pi pi-sign-out", command: logout },
]);

const menuHidden = ref(true);
const user = useCurrentUser();

const avatarLabel = computed(() => generateUserLabel(user.value));
const avatarColor = computed(() => createColorFromString(user.value?.email || "", 70, 70));
const avatarTextColor = computed(() => createColorFromString(user.value?.email || "", 70, 30));
</script>

<template>
  <div class="menu-container" :class="{ 'menu-hidden': menuHidden }">
    <Menu :model="items" class="w-full">
      <template #start>
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
          <div class="pi pi-chevron-up text-lg px-3 button-chevron" style=""></div>
        </button>
      </template>
    </Menu>
  </div>
</template>

<style scoped lang="scss">
.menu-container {
  overflow: hidden;
  transition: height 0.2s ease;
  height: 195px;
  border-bottom: 1px solid var(--bluegray-100);
  :deep(.p-menu) {
    border: none;
    border-radius: 0;
  }
  .button-chevron {
    transition: transform 0.2s ease;
  }
}
.menu-hidden {
  height: 56px;
  .button-chevron {
    transform: rotate(180deg);
  }
}
</style>
