<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import Button from "primevue/button";

const selectedValues = reactive([false, false, false, false, false, false]);

const selectedHeader = computed(() => {
  const index = selectedValues.findIndex((v) => v);
  return index === -1 ? false : index + 1;
});

const headerButtonsRefs = ref<Record<string, InstanceType<typeof Button>>>({});

const hCallback = (value: number) => (mutations: MutationRecord[]) => {
  mutations
    .filter((m) => m.attributeName === "class")
    .forEach((m) => {
      selectedValues[value - 1] = (m.target as HTMLElement).classList.contains("ql-active");
    });
};

watchOnce(
  () => Object.values(headerButtonsRefs.value).length === 6,
  () => {
    Object.values(headerButtonsRefs.value).forEach((button: any, index) => {
      useMutationObserver(button, hCallback(index + 1), { attributes: true });
    });
  }
);

const headerMenuVisible = ref(false);
const headerMenuButton = ref(null);
function toggleHeaderMenu() {
  headerMenuVisible.value = !headerMenuVisible.value;
}
const disableHeaderMenu = [
  () => {
    headerMenuVisible.value = false;
  },
  { ignore: [headerMenuButton] },
];

function turnHeaderOff() {
  Object.values(headerButtonsRefs.value).forEach((button) => {
    if (button.$el?.classList.contains("ql-active")) {
      button.$el?.click();
    }
  });
}
</script>

<template>
  <Button
    ref="headerMenuButton"
    type="button"
    text
    rounded
    :class="`ti ti-${selectedHeader ? 'h-' + selectedHeader : 'heading-off'} ${selectedHeader ? 'ql-active' : ''}`"
    @click="toggleHeaderMenu"
  />
  <div v-on-click-outside="disableHeaderMenu" class="header-menu-container">
    <Menu
      class="shadow-5"
      :model="[1, 2, 3, 4, 5, 6, false].map((value) => ({ value }))"
      :class="{ 'menu-hidden': !headerMenuVisible }"
    >
      <template #item="{ item }">
        <Button
          v-if="item.value"
          :ref="(el) => (headerButtonsRefs[item.value] = el)"
          :class="`ql-header ti ti-h-${item.value}`"
          rounded
          text
          :value="item.value"
        />
        <Button
          v-else
          rounded
          text
          :value="item.value"
          :class="{ active: !selectedHeader, ti: true, 'ti-heading-off': true }"
          @click="turnHeaderOff"
        >
        </Button>
      </template>
    </Menu>
  </div>
</template>

<style scoped lang="scss">
.header-menu-container {
  position: relative;
  z-index: 100;
  margin-bottom: -4px;
}
:deep(.p-menu) {
  position: absolute !important;
  right: 40px !important;
  top: -48px !important;
  padding: 6px !important;
  width: 264px !important;
  border: none !important;
  &.menu-hidden {
    visibility: hidden !important;
    pointer-events: none !important;
  }
}

button {
  font-size: 24px !important;
  width: 36px !important;
  height: 36px !important;
  padding-left: 6px !important;
  color: var(--bluegray-500) !important;
  &.ql-active,
  &.active {
    color: var(--surface-a) !important;
    background-color: var(--bluegray-700) !important;
  }
}

:global(*[data-theme="dark"] .toolbar button) {
  color: var(--bluegray-300) !important;
}
:global(*[data-theme="dark"] .toolbar button.ql-active),
:global(*[data-theme="dark"] .toolbar button.active) {
  color: var(--surface-a) !important;
  background-color: var(--bluegray-200) !important;
}
</style>
