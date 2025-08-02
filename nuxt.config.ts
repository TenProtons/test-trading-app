import { resolve } from 'path';

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  srcDir: './',

  css: [resolve(__dirname, './assets/scss/main.scss')],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  tailwindcss: {
    config: {
      content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
      ],
      darkMode: 'class',
      theme: {
        extend: {},
      },
      plugins: [],
    }
  },
})