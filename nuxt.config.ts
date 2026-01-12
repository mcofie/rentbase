// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },

    modules: [
        '@nuxt/ui',
        '@nuxt/fonts',
        '@nuxtjs/supabase',
    ],

    css: ['~/assets/css/main.css'],

    // Supabase configuration
    supabase: {
        url: process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        // Use custom 'rentbase' schema instead of 'public'
        clientOptions: {
            db: {
                schema: 'rentbase',
            },
        },
        redirectOptions: {
            login: '/auth/login',
            callback: '/auth/confirm',
            include: ['/dashboard(.*)'],
            exclude: ['/', '/contract/preview/*', '/contract/new', '/deposit/new'],
            cookieRedirect: false,
        },
    },

    // Environment variables
    runtimeConfig: {
        // Server-side only
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
        paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || 'placeholder',
        hubtelClientId: process.env.HUBTEL_CLIENT_ID || '',
        hubtelClientSecret: process.env.HUBTEL_CLIENT_SECRET || '',
        hubtelSenderId: process.env.HUBTEL_SENDER_ID || 'RentBase',

        // Public (client-side)
        public: {
            supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
            supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
            paystackPublicKey: process.env.NUXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
            appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
        },
    },

    // Fonts configuration
    fonts: {
        defaults: {
            weights: [400, 500, 600, 700],
            styles: ['normal'],
            subsets: ['latin', 'latin-ext'],
        },
    },

    // UI configuration
    ui: {
        // colorMode: true, // Enabled by default
    },
    colorMode: {
        preference: 'light',
        fallback: 'light',
        classSuffix: '',
    },

    // SSR enabled as per spec
    ssr: true,

    // App configuration
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            title: 'RentBase - The Carfax for Rentals in Africa',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {
                    name: 'description',
                    content: 'Verify agents, generate legal contracts, and protect your deposits. The trusted platform for renters in Ghana.'
                },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ],
            script: [
                { src: 'https://js.paystack.co/v1/inline.js', defer: true },
            ],
        },
    },
})