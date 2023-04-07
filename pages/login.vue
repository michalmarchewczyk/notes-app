<script setup lang="ts">
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  AuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
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

function loginEmail() {
  if (!auth) {
    return;
  }
  loadingEmail.value = true;
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      loadingEmail.value = false;
      navigateTo(route.query.redirect?.toString() || "/app");
    })
    .catch(async (err) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      loadingEmail.value = false;
      if (err.code === "auth/invalid-email") {
        error.value = "Invalid email address";
      } else if (["auth/wrong-password", "auth/user-not-found", "auth/user-disabled"].includes(err.code)) {
        error.value = "Invalid email or password";
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
    <template #title> Login {{ error }} </template>
    <template #content>
      <div class="flex flex-column align-items-stretch gap-3">
        <form class="flex flex-column align-items-stretch gap-3" @submit.prevent="loginEmail">
          <div class="flex flex-column gap-2">
            <label for="email">Email</label>
            <InputText id="email" v-model="email" type="email" required @input="error = ''" />
          </div>
          <div class="flex flex-column gap-2 mb-2">
            <label for="password">Password</label>
            <Password id="password" v-model="password" :feedback="false" toggle-mask required @input="error = ''" />
          </div>
          <InlineMessage v-if="error" severity="error">
            <span class="p-inline-message-icon ti ti-alert-circle text-xl vertical-align-middle" />
            {{ error }}
          </InlineMessage>
          <Button
            icon="ti ti-login"
            loading-icon="ti ti-spin ti-loader-2"
            label="Login"
            type="submit"
            :loading="loadingEmail"
          />
        </form>
        <NuxtLink to="/signup">
          <Button icon="ti ti-user-plus" label="Create Account" outlined class="w-full" />
        </NuxtLink>
        <Divider align="center" class="my-2"> or </Divider>
        <Button
          icon="ti ti-brand-google"
          :loading="loading[googleAuthProvider.providerId]"
          loading-icon="ti ti-spin ti-loader-2"
          label="Login with Google"
          severity="info"
          class="bg-blue-500"
          @click="login(googleAuthProvider)"
        />
        <Button
          icon="ti ti-brand-github"
          :loading="loading[githubAuthProvider.providerId]"
          loading-icon="ti ti-spin ti-loader-2"
          label="Login with GitHub"
          severity="secondary"
          class="surface-800"
          @click="login(githubAuthProvider)"
        />
      </div>
    </template>
  </Card>
</template>
