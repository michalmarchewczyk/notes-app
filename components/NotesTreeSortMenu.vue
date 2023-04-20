<script setup lang="ts">
import { MenuItem } from "primevue/menuitem";

const selectedSortMethod = useState<string>("selectedSortMethod", () => "created-desc");

const sortMethods: MenuItem[] = [
  {
    label: "Name (A-Z)",
    value: "title-asc",
    icon: "ti ti-sort-ascending-letters",
    command: () => {
      selectedSortMethod.value = "title-asc";
    },
  },
  {
    label: "Name (Z-A)",
    value: "title-desc",
    icon: "ti ti-sort-descending-letters",
    command: () => {
      selectedSortMethod.value = "title-desc";
    },
  },
  {
    label: "Created (Newest)",
    value: "created-desc",
    icon: "ti ti-sort-descending-numbers",
    command: () => {
      selectedSortMethod.value = "created-desc";
    },
  },
  {
    label: "Created (Oldest)",
    value: "created-asc",
    icon: "ti ti-sort-ascending-numbers",
    command: () => {
      selectedSortMethod.value = "created-asc";
    },
  },
];

const sortMenu = ref(null);
</script>

<template>
  <Button
    :icon="sortMethods.find((m) => m.value === selectedSortMethod)?.icon"
    text
    @click="(e) => sortMenu.toggle(e)"
  />
  <Menu ref="sortMenu" :model="sortMethods" :popup="true" append-to=".buttons-container">
    <template #item="{ item }">
      <span class="menu-item" :class="{ 'menu-item-selected': selectedSortMethod === item.value }">
        <i :class="item.icon"></i>{{ item.label }}
      </span>
    </template>
  </Menu>
</template>

<style scoped lang="scss">
button {
  height: 3rem;
  :deep(.ti) {
    font-size: 1.5rem;
  }
}
.menu-item {
  display: flex;
  padding: 12px;
  cursor: pointer;
  align-items: center;
  gap: 0.5rem;
  &.menu-item-selected {
    color: var(--primary-color);
  }
  i {
    font-size: 1.5rem;
  }
}
</style>
