<script setup lang="ts">
import { computed } from 'vue';

const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const isDark = computed(() => colorMode.value === 'dark');
</script>

<template>
  <button @click="toggleTheme" class="theme-switcher">
    <span v-if="isDark">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<style lang="scss" scoped>
.theme-switcher {
  @apply p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-xl;
}
</style>