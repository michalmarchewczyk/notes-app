<script setup lang="ts"></script>

<template>
  <div class="toolbar shadow-5">
    <NoteEditorToolbarHeaderMenu />
    <Divider vertical />
    <Button class="ql-bold ti ti-bold" rounded text />
    <Button class="ql-italic ti ti-italic" rounded text />
    <Button class="ql-underline ti ti-underline" rounded text />
    <Button class="ql-strike ti ti-strikethrough" rounded text />
    <!--    <Divider vertical />-->
    <Button class="ql-script ti ti-superscript" rounded text value="super" />
    <Button class="ql-script ti ti-subscript" rounded text value="sub" />
    <Divider vertical class="hide-small" />
    <Button class="ql-list ti ti-list" rounded text value="bullet" />
    <Button class="ql-list ti ti-list-numbers" rounded text value="ordered" />
    <!--    <Divider vertical />-->
    <Button class="ql-blockquote ti ti-quote" rounded text />
    <Button class="ql-link ti ti-link" rounded text />
    <Button class="ql-code ti ti-code-dots" rounded text />
    <Button class="ql-code-block ti ti-code" rounded text />
    <Divider vertical />
    <Button class="ql-clean ti ti-clear-formatting" rounded text />
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  row-gap: 4px;
  column-gap: 12px;
  border-radius: 8px !important;
  padding: 10px;
  background-color: var(--surface-a) !important;
  .p-divider {
    margin-top: 2px;
    margin-bottom: 2px;
    width: 36px !important;
    position: relative;
    &::before {
      width: 36px !important;
      border-top: 1px solid var(--bluegray-100);
    }
  }
  :deep(svg) {
    display: none !important;
  }
  button {
    font-size: 24px;
    width: 36px;
    height: 36px !important;
    color: var(--bluegray-500) !important;
    &.ql-active {
      color: var(--surface-a) !important;
      background-color: var(--bluegray-700) !important;
    }
  }
}
:global(*[data-theme="dark"] .toolbar button) {
  color: var(--bluegray-300) !important;
}
:global(*[data-theme="dark"] .toolbar button.ql-active) {
  color: var(--surface-a) !important;
  background-color: var(--bluegray-200) !important;
}
.hide-small {
  @media (max-height: 720px) {
    display: none;
  }
}
</style>
