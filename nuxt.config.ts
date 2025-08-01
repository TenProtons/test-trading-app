import { resolve } from 'path';

export default defineNuxtConfig({
  devtools: { enabled: true },

  // Вказуємо Nuxt шлях до кореневої папки
  srcDir: './',

  // Явно вказуємо шлях до папки з файлами стилів
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
        './app.vue'
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
  },
})