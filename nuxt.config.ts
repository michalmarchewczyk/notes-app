// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css",
    "primevue/resources/primevue.css",
    "@/node_modules/@tabler/icons-webfont/tabler-icons.min.css",
    "primeflex/primeflex.css",
    "@/assets/main.scss",
    "@/assets/dark-theme.scss",
  ],
  build: {
    transpile: ["primevue"],
  },
  modules: ["nuxt-vuefire", "@vueuse/nuxt"],
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      appId: process.env.FIREBASE_APP_ID,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    },
    admin: {
      serviceAccount: "firebase-service-account-file.json",
    },
    auth: true,
  },
});
