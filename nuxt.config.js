export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'marchewczyk-notes',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.png' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/styles/utils.scss',
    '@/assets/fonts/fonts.css',
    '@/assets/styles/main.scss',
    '@/assets/styles/scrollbar.scss'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/firebase'
  ],

  firebase: {
    config: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    },
    services: {
      auth: {
        persistence: 'local', // default
        initialize: {
          onAuthStateChangedMutation: 'user/ON_AUTH_STATE_CHANGED_MUTATION',
          onAuthStateChangedAction: 'user/onAuthStateChangedAction',
          subscribeManually: false
        },
        ssr: true // default
        // emulatorPort: 9099,
        // emulatorHost: 'http://localhost',
        // disableEmulatorWarnings: true
      },
      firestore: {
        memoryOnly: false, // default
        chunkName: process.env.NODE_ENV !== 'production' ? 'firebase-auth' : '[id]', // default
        // enablePersistence: false
        enablePersistence: {
          synchronizeTabs: true
        }
        // emulatorPort: 8080,
        // emulatorHost: 'localhost'
        // settings: {
        //   // Firestore Settings - currently only works in SPA mode
        // }
      }
    }
  },

  pwa: {
    meta: {
      name: 'Marchewczyk.notes',
      theme_color: '#000000'
    },
    manifest: {
      name: 'Marchewczyk.notes',
      start_url: '/'
    },
    workbox: {
      enabled: true,
      // offlineStrategy: 'NetworkFirst',
      offlineStrategy: 'CacheFirst',
      // offlineStrategy: 'StaleWhileRevalidate',
      importScripts: [
        '/firebase-auth-sw.js'
      ]
      // dev: process.env.NODE_ENV === 'development'
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
