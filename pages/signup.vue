<script setup lang="ts">
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  AuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "@firebase/auth";

definePageMeta({
  layout: "auth",
});

const googleAuthProvider = new GoogleAuthProvider();
const githubAuthProvider = new GithubAuthProvider();
googleAuthProvider.addScope("email");
githubAuthProvider.addScope("user:email");

const auth = useFirebaseAuth();
const route = useRoute();

const loading = reactive<Record<AuthProvider["providerId"], boolean>>({});

const email = ref("");
const password = ref("");
const loadingEmail = ref(false);
const error = ref("");

function createEmail() {
  if (!auth) {
    return;
  }
  loadingEmail.value = true;
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      loadingEmail.value = false;
      navigateTo(route.query.redirect?.toString() || "/app");
    })
    .catch((err) => {
      loadingEmail.value = false;
      if (err.code === "auth/invalid-email") {
        error.value = "Invalid email address";
      } else if (err.code === "auth/email-already-in-use") {
        error.value = "Email already in use";
      } else if (err.code === "auth/weak-password") {
        error.value = "Password is too weak";
      } else {
        error.value = "Something went wrong";
      }
    });
}

function login(provider: AuthProvider) {
  if (!auth) {
    return;
  }
  loading[provider.providerId] = true;
  signInWithPopup(auth, provider)
    .then(() => {
      loading[provider.providerId] = false;
      navigateTo(route.query.redirect?.toString() || "/app");
    })
    .catch((err) => {
      loading[provider.providerId] = false;
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/user-cancelled") {
        error.value = "Something went wrong";
      }
    });
}
</script>

<template>
  <Card class="w-20rem">
    <template #title> Create account {{ error }} </template>
    <template #content>
      <div class="flex flex-column align-items-stretch gap-3">
        <form class="flex flex-column align-items-stretch gap-3" @submit.prevent="createEmail">
          <div class="flex flex-column gap-2">
            <label for="email">Email</label>
            <InputText id="email" v-model="email" type="email" required @input="error = ''" />
          </div>
          <div class="flex flex-column gap-2 mb-2">
            <label for="password">Password</label>
            <Password id="password" v-model="password" :feedback="false" toggle-mask required @input="error = ''" />
          </div>
          <InlineMessage v-if="error" severity="error">{{ error }}</InlineMessage>
          <Button icon="pi pi-user-plus" label="Sign up" type="submit" :loading="loadingEmail" />
        </form>
        <NuxtLink to="/login">
          <Button icon="pi pi-sign-in" label="Login" outlined class="w-full" />
        </NuxtLink>
        <Divider align="center" class="my-2"> or </Divider>
        <Button
          icon="pi pi-google"
          :loading="loading[googleAuthProvider.providerId]"
          label="Sign up with Google"
          severity="info"
          class="bg-blue-500"
          @click="login(googleAuthProvider)"
        />
        <Button
          icon="pi pi-github"
          :loading="loading[githubAuthProvider.providerId]"
          label="Sign up with GitHub"
          severity="secondary"
          class="surface-800"
          @click="login(githubAuthProvider)"
        />
      </div>
    </template>
  </Card>
</template>
