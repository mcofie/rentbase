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
        // Cloudflare Turnstile (CAPTCHA) - server secret
        turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
        // Email service API keys (choose one)
        resendApiKey: process.env.RESEND_API_KEY || '',
        sendgridApiKey: process.env.SENDGRID_API_KEY || '',

        // Public (client-side)
        public: {
            supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
            supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
            paystackPublicKey: process.env.NUXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
            appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
            // Cloudflare Turnstile (CAPTCHA) - public site key
            turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
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

    // Nitro server configuration
    nitro: {
        // Security headers for all routes
        routeRules: {
            '/**': {
                headers: {
                    'X-Frame-Options': 'DENY',
                    'X-Content-Type-Options': 'nosniff',
                    'X-XSS-Protection': '1; mode=block',
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
                },
            },
            // Allow Paystack webhook
            '/api/paystack/webhook': {
                headers: {
                    'Access-Control-Allow-Origin': 'https://api.paystack.co',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type, x-paystack-signature',
                },
            },
        },
    },

    // Route rules for caching
    routeRules: {
        // Static assets - cache for 1 year
        '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
        // API routes - no cache
        '/api/**': { headers: { 'cache-control': 'no-store, no-cache, must-revalidate' } },
    },

    // App configuration
    app: {
        pageTransition: { name: 'page' },
        head: {
            title: 'RentBase - The Carfax for Rentals in Africa',
            htmlAttrs: {
                lang: 'en',
            },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
                {
                    name: 'description',
                    content: 'Verify agents, generate legal contracts, and protect your deposits. The trusted platform for renters in Ghana.'
                },
                // Security meta tags
                { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
                { name: 'format-detection', content: 'telephone=no' },
                // PWA meta tags
                { name: 'theme-color', content: '#0075DE' },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
                { name: 'apple-mobile-web-app-title', content: 'RentBase' },
                { name: 'mobile-web-app-capable', content: 'yes' },
                { name: 'application-name', content: 'RentBase' },
                { name: 'msapplication-TileColor', content: '#0075DE' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                // PWA manifest
                { rel: 'manifest', href: '/manifest.json' },
                // Apple touch icons
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/icon-192x192.png' },
                // Preconnect to external resources
                { rel: 'preconnect', href: 'https://js.paystack.co' },
                { rel: 'dns-prefetch', href: 'https://js.paystack.co' },
            ],
            script: [
                { src: 'https://js.paystack.co/v1/inline.js', defer: true },
            ],
        },
    },
})