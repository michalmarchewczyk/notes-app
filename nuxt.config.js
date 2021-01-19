export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Marchewczyk.notes',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=0.8, maximum-scale=5, minimum-scale=0.8' },
      { hid: 'description', name: 'description', content: 'Simple notes app' }
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

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/pwa'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
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
        persistence: 'local',
        initialize: {
          onAuthStateChangedMutation: 'user/ON_AUTH_STATE_CHANGED_MUTATION',
          onAuthStateChangedAction: 'user/onAuthStateChangedAction',
          subscribeManually: false
        },
        ssr: true
      },
      firestore: {
        memoryOnly: false,
        chunkName: process.env.NODE_ENV !== 'production' ? 'firebase-auth' : '[id]',
        enablePersistence: {
          synchronizeTabs: true
        }
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
      offlineStrategy: 'CacheFirst',
      importScripts: [
        '/firebase-auth-sw.js'
      ]
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
