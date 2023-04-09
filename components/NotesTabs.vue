<script setup lang="ts">
import { TabViewChangeEvent } from "primevue/tabview";

const route = useRoute();

const notes = useSharedNotes();

const noteTabs = ref<{ key: string }[]>([]);
const activeTab = ref(0);
const lastOpened = ref<string[]>([]);

const noteTitles = computed(() => {
  return notes.value.reduce((acc, note) => {
    acc[note.id] = note.title;
    return acc;
  }, {} as Record<string, string>);
});

watch(
  route,
  () => {
    if (route.params.noteKey) {
      if (!noteTabs.value.find((note) => note.key === route.params.noteKey)) {
        noteTabs.value.push({ key: route.params.noteKey.toString() });
      }
      activeTab.value = noteTabs.value.findIndex((note) => note.key === route.params.noteKey);
      lastOpened.value = lastOpened.value.filter((key) => key !== route.params.noteKey);
      lastOpened.value.push(route.params.noteKey.toString());
    }
  },
  { immediate: true }
);

function closeTab(key: string) {
  noteTabs.value = noteTabs.value.filter((note) => note.key !== key);
  lastOpened.value = lastOpened.value.filter((note) => note !== key);
  if (lastOpened.value.length === 0) {
    navigateTo("/app/notes");
  } else {
    navigateTo(`/app/notes/${lastOpened.value[lastOpened.value.length - 1]}`);
  }
  activeTab.value = noteTabs.value.findIndex((note) => note.key === route.params.noteKey);
}

function tabChange(event: TabViewChangeEvent) {
  if (route.params.noteKey !== noteTabs.value[event.index].key) {
    navigateTo(`/app/notes/${noteTabs.value[event.index].key}`);
  }
}
</script>

<template>
  <div>
    <TabView v-if="noteTabs.length > 0" v-model:active-index="activeTab" @tab-change="tabChange">
      <TabPanel v-for="note in noteTabs" :key="note.key">
        <template #header>
          <div class="tab" @click.middle.prevent.stop="closeTab(note.key)">
            <span>{{ noteTitles[note.key] ?? "-" }}</span>
            <Button icon="ti ti-x" severity="secondary" text rounded @click.prevent.stop="closeTab(note.key)" />
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
  .p-tabview-header-action {
    background: transparent !important;
    padding: 0.2rem !important;
    max-width: 100%;
    border-radius: 8px !important;
    border-width: 0 !important;
    margin: 0 !important;
    transition: none !important;
  }
  &.p-highlight {
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    .p-tabview-header-action {
      background: #ffffff !important;
    }
  }
}

.tab {
  max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 1rem;
  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  button {
    height: 1.3rem !important;
    width: 1.3rem !important;
    padding: 0.2rem 0;
  }
}
</style>
