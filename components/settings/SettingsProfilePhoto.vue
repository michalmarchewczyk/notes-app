<script setup lang="ts">
import { updateCurrentUserProfile, useFirebaseStorage, useStorageFile } from "vuefire";
import { ref as storageRef } from "firebase/storage";
import { FileUploadUploaderEvent } from "primevue/fileupload";
import generateUserLabel from "~/utils/generateUserLabel";

const user = useCurrentUser();
const storage = useFirebaseStorage();

const { url, uploadProgress, upload } = useStorageFile(storageRef(storage, `users/${user.value?.uid}/avatar`));

async function uploadPhoto(event: FileUploadUploaderEvent) {
  const file = Array.isArray(event.files) ? event.files[0] : event.files;
  if (!file) return;
  const data = await file.arrayBuffer();
  await upload(data, { contentType: file.type });
}

watch(url, () => {
  if (url.value && user.value?.photoURL !== url.value) {
    updateCurrentUserProfile({ photoURL: url.value });
  }
});

const avatarLabel = computed(() => generateUserLabel(user.value));
const avatarColor = computed(() => createColorFromString(user.value?.email || "", 70, 70));
const avatarTextColor = computed(() => createColorFromString(user.value?.email || "", 70, 30));
</script>

<template>
  <div class="setting">
    <div>
      <h2>Profile photo</h2>
      <span> Upload photo to use as profile picture </span>
      <br />
      <span class="font-bold mt-3 inline-block">Current photo: </span>
      <br />
      <div class="mt-3">
        <Avatar v-if="user?.photoURL" :image="user?.photoURL" />
        <Avatar v-else :label="avatarLabel" :style="{ background: avatarColor, color: avatarTextColor }" />
      </div>
    </div>
    <FileUpload
      accept="image/*"
      :multiple="false"
      custom-upload
      :file-limit="1"
      :max-file-size="1000 * 1000 * 5"
      @uploader="uploadPhoto"
    >
      <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
        <div class="flex flex-row justify-content-between w-full">
          <Button v-if="files.length === 0" icon="ti ti-plus" label="Choose" text @click="chooseCallback" />
          <Button v-if="files.length > 0" icon="ti ti-x" label="Clear" text @click="clearCallback" />
          <Button icon="ti ti-upload" label="Upload" :disabled="files.length === 0" @click="uploadCallback" />
        </div>
        <ProgressBar
          v-if="uploadProgress > 0.01 && uploadProgress < 1"
          :value="uploadProgress * 100"
          :show-value="false"
        />
      </template>
      <template #content="{ files }">
        <div v-if="files.length > 0">
          <img :alt="files[0]?.name" :src="files[0]?.objectURL" />
        </div>
      </template>
      <template #empty>
        <i class="ti ti-upload"></i>
        <span>Drag and drop file here to upload.</span>
      </template>
    </FileUpload>
  </div>
</template>

<style scoped lang="scss">
.p-fileupload {
  :deep(.p-fileupload-buttonbar) {
    position: relative;
    padding: 0.5rem 0.7rem !important;
    z-index: 1;
    button {
      padding: 0.5rem 1rem !important;
    }
    .p-progressbar {
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 100%;
      height: 6px;
    }
  }
  :deep(.p-fileupload-content) {
    width: 340px;
    height: 170px;
    padding: 0;
    > div {
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  :deep(.p-fileupload-empty) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    i {
      font-size: 3rem;
      color: var(--bluegray-300);
    }
    span {
      font-size: 1.2rem;
      color: var(--bluegray-300);
    }
  }
}
.p-avatar {
  border-radius: 8px !important;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 1px solid var(--surface-300);
  :deep(.p-avatar-text) {
    font-size: 3.5rem;
    user-select: none;
  }
}
</style>
