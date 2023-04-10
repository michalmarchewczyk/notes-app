<script setup lang="ts">
import { updateCurrentUserProfile, useFirebaseStorage, useStorageFile } from "vuefire";
import { FileUploadUploaderEvent } from "primevue/fileupload";
import { ref as storageRef } from "firebase/storage";
import generateUserLabel from "~/utils/generateUserLabel";

const user = useCurrentUser();

const userData = useUserData();

const username = ref("");

watch(
  () => !!user.value?.displayName,
  () => {
    if (!username.value) {
      username.value = user.value?.displayName ?? "";
    }
  },
  { immediate: true }
);

watchDebounced(
  username,
  () => {
    updateCurrentUserProfile({ displayName: username.value });
  },
  { debounce: 500, maxWait: 1000 }
);

const theme = computed(() => userData.data.value?.theme ?? "light");

function switchTheme({ value }: { value: string }) {
  if (!value) return;
  userData.update({ theme: value.toLowerCase() });
}

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

function closeSettings() {
  navigateTo("/app");
}

const avatarLabel = computed(() => generateUserLabel(user.value));
const avatarColor = computed(() => createColorFromString(user.value?.email || "", 70, 70));
const avatarTextColor = computed(() => createColorFromString(user.value?.email || "", 70, 30));
</script>

<template>
  <ScrollPanel>
    <div class="container">
      <div class="header">
        <h1>Settings</h1>
        <Button icon="ti ti-x" size="large" text rounded severity="secondary" @click="closeSettings"></Button>
      </div>
      <div class="setting">
        <div>
          <h2>Theme</h2>
          <span> Color theme that will be applied to the interface </span>
        </div>
        <SelectButton
          :model-value="theme === 'dark' ? 'Dark' : 'Light'"
          :options="['Light', 'Dark']"
          @change="switchTheme"
        />
      </div>
      <Divider />
      <div class="setting">
        <div>
          <h2>Username</h2>
          <span> Set profile username </span>
        </div>
        <InputText v-model="username" placeholder="Username" />
      </div>
      <Divider />
      <div class="setting">
        <div>
          <h2>Profile photo</h2>
          <span> Upload photo to use as profile picture </span>
          <br />
          <span class="font-bold mt-3 inline-block">Current photo: </span>
          <br />
          <div class="mt-3">
            <Avatar v-if="user?.photoURL" shape="square" :image="user?.photoURL" />
            <Avatar
              v-else
              :label="avatarLabel"
              shape="square"
              :style="{ background: avatarColor, color: avatarTextColor }"
            />
          </div>
        </div>
        <FileUpload
          accept="image/*"
          cancel-icon="ti ti-x"
          choose-icon="ti ti-plus"
          upload-icon="ti ti-upload"
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
    </div>
  </ScrollPanel>
</template>

<style scoped lang="scss">
.p-scrollpanel {
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 1032px;
  padding-left: 16px;
  padding-right: 16px;
  margin: 0 auto;
  :deep(.p-scrollpanel-bar-y) {
    background-color: var(--bluegray-200);
    border-radius: 10px;
    width: 10px;
  }
}
.container {
  color: var(--text-color);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 2rem 4rem;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    h1 {
      font-weight: 800;
    }
    button {
      :deep(span) {
        &::before {
          font-size: 26px;
        }
      }
    }
  }
}
.setting {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 4px;
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.6rem;
    margin-top: 0;
  }
  span {
    font-size: 1.1rem;
    flex-shrink: 2;
  }
  :last-child {
    flex-shrink: 0;
  }
}
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
