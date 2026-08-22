// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@nuxt/eslint",
        "@nuxt/ui",
        "@vueuse/nuxt",
        "@nuxtjs/supabase",
        "@pinia/nuxt",
    ],
    app: {
        rootAttrs: {
            "data-vaul-drawer-wrapper": "",
            "class": "bg-(--ui-bg)",
        },
        head: {
            meta: [
                { name: "color-scheme", content: "dark light" },
            ],
            link: [
                { rel: "preconnect", href: process.env.SUPABASE_URL || "https://zcskhtwiihvtaaeuogwq.supabase.co" },
            ],
        },
        // pageTransition: { name: "page", mode: "out-in" },
        // layoutTransition: { name: "layout", mode: "out-in" },
    },
    runtimeConfig: {
        // Private keys are only available on the server
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

        // Public keys that are exposed to the client
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
        },
    },
    devtools: {
        enabled: true,
    },

    css: ["~/assets/css/main.css"],

    routeRules: {
        // Pas de CORS ouvert : les appels API sont same-origin.
        // Pour un futur client cross-origin (ex: mobile), configurer
        // explicitement les en-têtes Access-Control-Allow-* ici.
        "/_nuxt/**": {
            headers: {
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        },
        "/**": {
            headers: {
                "Cache-Control": "public, max-age=0, must-revalidate",
            },
        },
    },
    supabase: {
        clientOptions: {
            auth: {
                experimental: {
                    passkey: true, // Active le support des passkeys
                },
            },
        },
        redirectOptions: {
            login: "/auth",
            callback: "/confirm",
            include: [],
            exclude: [],
            saveRedirectToCookie: true,
        },
    },
    devServer: {
        port: 3006,
    },
    compatibilityDate: "2026-04-03",
    nitro: {
        externals: {
            inline: ["@supabase/supabase-js"],
        },
    },
    icon: {
        serverBundle: "local",
    },
    eslint: {
        config: {
            stylistic: {
                commaDangle: "never",
                braceStyle: "1tbs",
            },
        },
    },
});
