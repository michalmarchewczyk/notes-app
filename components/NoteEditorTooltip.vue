<script setup lang="ts">
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

function turnHeaderOff() {
  Object.values(headerButtonsRefs.value).forEach((button) => {
    if (button.$el?.classList.contains("ql-active")) {
      button.$el?.click();
    }
  });
}
</script>

<template>
  <div class="tooltip-container shadow-6">
    <Button :ref="(el) => (headerButtonsRefs[1] = el)" class="ql-header ti ti-h-1" rounded text :value="1" />
    <Button :ref="(el) => (headerButtonsRefs[2] = el)" class="ql-header ti ti-h-2" rounded text :value="2" />
    <Button
      :ref="(el) => (headerButtonsRefs[3] = el)"
      class="ql-header ti ti-h-3"
      rounded
      text
      :value="3"
      style="display: none"
    />
    <Button
      :ref="(el) => (headerButtonsRefs[4] = el)"
      class="ql-header ti ti-h-4"
      rounded
      text
      :value="4"
      style="display: none"
    />
    <Button
      :ref="(el) => (headerButtonsRefs[5] = el)"
      class="ql-header ti ti-h-5"
      rounded
      text
      :value="5"
      style="display: none"
    />
    <Button
      :ref="(el) => (headerButtonsRefs[6] = el)"
      class="ql-header ti ti-h-6"
      rounded
      text
      :value="6"
      style="display: none"
    />
    <Button
      :class="{ active: !selectedHeader, ti: true, 'ti-heading-off': true }"
      rounded
      text
      @click="turnHeaderOff"
    />
    <Button class="ql-link ti ti-link" rounded text />
    <Button class="ql-blockquote ti ti-quote" rounded text />
    <Button class="ql-bold ti ti-bold" rounded text />
    <Button class="ql-italic ti ti-italic" rounded text />
    <Button class="ql-underline ti ti-underline" rounded text />
    <Button class="ql-strike ti ti-strikethrough" rounded text />
    <Button class="ql-clean ti ti-clear-formatting" rounded text />
  </div>
</template>

<style scoped lang="scss">
.tooltip-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-start;
  align-items: flex-start;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--surface-900);
  border-radius: 8px;
  padding: 8px;
  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: 96px;
    width: 0;
    height: 0;
    border-bottom: 10px solid var(--surface-900);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
  }
  :deep(svg) {
    display: none !important;
  }
  button {
    font-size: 24px;
    width: 36px;
    height: 36px !important;
    color: var(--bluegray-100) !important;
    &.ql-active,
    &.active {
      color: var(--surface-900) !important;
      background-color: var(--bluegray-100) !important;
    }
  }
}
:global(*[data-theme="dark"] .tooltip-container button) {
  color: var(--surface-a) !important;
}
:global(*[data-theme="dark"] .tooltip-container button.ql-active),
:global(*[data-theme="dark"] .tooltip-container button.active) {
  color: var(--bluegray-50) !important;
  background-color: var(--surface-a) !important;
}
</style>
