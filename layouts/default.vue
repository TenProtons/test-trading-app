<script setup lang="ts">
import { useHead } from 'nuxt/app';
import ThemeSwitcher from '../components/ui/ThemeSwitcher.vue';
useHead({
  bodyAttrs: {
    class: 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300'
  }
})
</script>

<template>
  <div class="app-layout">
    <header class="app-layout__header">
      <h1 class="app-layout__title">Селектор Торгових Пар</h1>
      <ThemeSwitcher />
    </header>
    <main class="app-layout__main">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  @apply min-h-screen;

  &__header {
    @apply container mx-auto p-4 flex justify-between items-center;
  }

  &__title {
    @apply text-2xl font-bold text-blue-500;
  }

  &__main {
    @apply p-4;
  }
}
</style>