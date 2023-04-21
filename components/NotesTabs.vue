<script setup lang="ts">
import { TabViewChangeEvent } from "primevue/tabview";

const route = useRoute();
const { notes } = useSharedNotes();
const userData = useSharedUserData();

const activeTab = ref(-1);
const loading = ref(false);

const noteTitles = computed(() => {
  return notes.value.reduce((acc, note) => {
    acc[note.id] = note.title;
    return acc;
  }, {} as Record<string, string>);
});

const noteTabs = computed(() => {
  return userData.data.value?.noteTabs ?? [];
});
const lastOpened = computed(() => {
  return userData.data.value?.lastOpened ?? [];
});

watch(
  [() => route.params.noteKey, () => noteTabs.value.join(","), loading, () => userData.data.value === undefined],
  () => {
    if (route.params.noteKey && userData.data.value && !loading.value) {
      if (!noteTabs.value.find((note) => note === route.params.noteKey)) {
        const newNoteTabs = [...noteTabs.value, route.params.noteKey.toString()];
        userData.update({ noteTabs: newNoteTabs });
      }
      activeTab.value = noteTabs.value.findIndex((note) => note === route.params.noteKey);
      const newLastOpened = lastOpened.value.filter(
        (key) => key !== route.params.noteKey && noteTabs.value.includes(key)
      );
      newLastOpened.push(route.params.noteKey.toString());
      userData.update({ lastOpened: newLastOpened });
    }
  },
  { immediate: true }
);

watchArray(
  notes,
  (_, __, added, removed) => {
    if (!added[0] && removed[0]) {
      closeTab(removed[0].id);
    }
  },
  { deep: true }
);

async function closeTab(key: string) {
  loading.value = true;
  const newNoteTabs = noteTabs.value.filter((note) => note !== key);
  const newLastOpened = lastOpened.value.filter((note) => note !== key);
  if (newLastOpened.length === 0) {
    navigateTo("/app/notes");
  } else {
    navigateTo(`/app/notes/${newLastOpened[newLastOpened.length - 1]}`);
  }
  // activeTab.value = newNoteTabs.findIndex((note) => note === route.params.noteKey);
  await userData.update({ noteTabs: newNoteTabs, lastOpened: newLastOpened });
  loading.value = false;
}

function tabChange(event: TabViewChangeEvent) {
  if (route.params.noteKey !== userData.data.value?.noteTabs?.[event.index]) {
    navigateTo(`/app/notes/${userData.data.value?.noteTabs?.[event.index]}`);
  }
}
</script>

<template>
  <div>
    <TabView v-if="noteTabs.length > 0" v-model:active-index="activeTab" @tab-change="tabChange">
      <TabPanel v-for="note in noteTabs" :key="note">
        <template #header>
          <div class="tab" @click.middle.prevent.stop="closeTab(note)">
            <span>{{ noteTitles[note] ?? "-" }}</span>
            <Button icon="ti ti-x" severity="secondary" text rounded @click.prevent.stop="closeTab(note)" />
          </div>
        </template>
      </TabPanel>
    </TabView>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-tabview-nav) {
  background: transparent;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem 0.6rem;
  border: none;
  border-bottom: 2px solid var(--bluegray-100);
}
:deep(.p-tabview-panels) {
  display: none;
}
:deep(.p-tabview-header) {
  flex-grow: 0;
  flex-shrink: 1;
  overflow: hidden;
  display: block;
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--surface-200);
  .p-tabview-header-action {
    background: transparent !important;
    padding: 0 !important;
    max-width: 100%;
    border-radius: 8px !important;
    border-width: 0 !important;
    margin: 0 !important;
    transition: none !important;
  }
  &.p-highlight {
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    .p-tabview-header-action {
      background: var(--surface-f) !important;
    }
  }
}

.tab {
  max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;
  padding: 0.9rem 1.2rem;
  //background: red;
  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  button {
    height: 1.3rem !important;
    width: 1.3rem !important;
    padding: 0.2rem 0 !important;
  }
}
</style>
