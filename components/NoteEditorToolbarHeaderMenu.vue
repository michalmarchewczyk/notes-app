<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";

const selectedValues = reactive([false, false, false, false, false, false]);

const selectedHeader = computed(() => {
  const index = selectedValues.findIndex((v) => v);
  return index === -1 ? false : index + 1;
});

const h1Button = ref(null);
const h2Button = ref(null);
const h3Button = ref(null);
const h4Button = ref(null);
const h5Button = ref(null);
const h6Button = ref(null);

const hCallback = (value: number) => (mutations: MutationRecord[]) => {
  mutations
    .filter((m) => m.attributeName === "class")
    .forEach((m) => {
      selectedValues[value - 1] = (m.target as HTMLElement).classList.contains("ql-active");
    });
};

[h1Button, h2Button, h3Button, h4Button, h5Button, h6Button].forEach((button, index) => {
  useMutationObserver(button, hCallback(index + 1), { attributes: true });
});

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
  <div v-on-click-outside="disableHeaderMenu" class="menu-container">
    <Menu
      class="shadow-5"
      :model="[1, 2, 3, 4, 5, 6].map((value) => ({ value }))"
      :class="{ 'menu-hidden': !headerMenuVisible }"
    >
      <template #item="{ item }">
        <Button
          :ref="`h${item.value}Button`"
          :class="`ql-header ti ti-h-${item.value}`"
          rounded
          text
          :value="item.value"
        />
      </template>
    </Menu>
  </div>
</template>

<style scoped lang="scss">
.menu-container {
  position: relative;
  z-index: 100;
  margin-bottom: -4px;
}
:deep(.p-menu) {
  position: absolute !important;
  right: 40px !important;
  top: -48px !important;
  padding: 6px !important;
  width: 230px !important;
  border: none !important;
  &.menu-hidden {
    visibility: hidden !important;
    pointer-events: none !important;
  }
}

button {
  font-size: 24px;
  width: 36px !important;
  height: 36px !important;
  padding-left: 6px !important;
  color: var(--bluegray-500) !important;
  &.ql-active {
    color: var(--surface-a) !important;
    background-color: var(--bluegray-700) !important;
  }
}

:global(*[data-theme="dark"] .toolbar button) {
  color: var(--bluegray-300) !important;
}
:global(*[data-theme="dark"] .toolbar button.ql-active) {
  color: var(--surface-a) !important;
  background-color: var(--bluegray-200) !important;
}
</style>
