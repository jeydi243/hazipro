import path from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],

  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/fonts', '@vueuse/nuxt', 'shadcn-nuxt', 'radix-vue/nuxt', '@pinia/nuxt', '@nuxtjs/supabase', 'nuxt-security'],
  ui: {
    // icons: ['heroicons', 'simple-icons', 'solar'],
    safelistColors: ['primary', 'red', 'orange', 'green'],
    
  },
  tailwindcss: {
    quiet: true,
  },
  colorMode: {
    disableTransition: true,
  },
  plugins: ['~/plugins/preline.client.ts'],
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      SUPABASE_ROLE_KEY: process.env.SUPABASE_ROLE_KEY,
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    redirectOptions: {
      login: '/auth',
      callback: '/',
      include: undefined,
      exclude: [],
      cookieRedirect: false,
    },
  },
  routeRules: {
    '/': { prerender: true, cors: true },
    '/nf': { cors: true },
  },
  security: {
    headers: {
      crossOriginResourcePolicy: 'cross-origin',
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: {
        'connect-src': ["'self'", 'https:', 'http:'],
        'img-src': ["'self'", 'data:', 'https:'],
        'frame-src': ["'self'"],
      },
    },
  },
  typescript: {
    strict: false,
  },

  future: {
    compatibilityVersion: 4,
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./app/components/ui"
     */
    componentDir: './app/components/ui',
  },
  devServer: { port: 5000 },
  compatibilityDate: '2024-07-11',
  alias: {
    '~/lib': './lib',
  },
})