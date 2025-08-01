import { resolve } from 'path'; 

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  tailwindcss: {
    config: {
      darkMode: 'class', // Вказуємо, що темний режим працює через клас
    }
  },

  css: [resolve(__dirname, './assets/scss/main.scss')],
})