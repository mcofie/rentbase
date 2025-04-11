// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: ['@nuxt/ui', '@nuxt/fonts'],
    css: ['~/assets/css/main.css'],
    fonts: {
        defaults: {
            weights: [400],
            styles: ['normal', 'italic'],
            subsets: [
                'cyrillic-ext',
                'cyrillic',
                'greek-ext',
                'greek',
                'vietnamese',
                'latin-ext',
                'latin',
            ]
        },
    }
})