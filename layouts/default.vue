<script setup lang="ts">
import { useTheme } from '../composables/useTheme';

const { theme, toggleTheme } = useTheme();
</script>

<template>
  <div class="app-layout">
    <header class="app-layout__header">
      <h1 class="app-layout__title">Селектор Торгових Пар</h1>
      
      <button v-if="theme" @click="toggleTheme" class="theme-switcher">
        {{ theme === 'dark-mode' ? '☀️' : '🌙' }}
      </button>
    </header>
    <main class="app-layout__main">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.theme-switcher {
  @apply p-2 rounded-full bg-gray-200 text-xl;
}

.dark .theme-switcher {
  @apply bg-gray-700;
}

.app-layout {
  @apply min-h-screen bg-gray-100 text-gray-900 transition-colors duration-300;
  
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

.dark .app-layout {
  @apply bg-gray-900 text-gray-100;
}
</style>