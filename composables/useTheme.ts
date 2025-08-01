import { ref, onMounted, readonly } from 'vue';

type Theme = 'light-mode' | 'dark-mode';

const theme = ref<Theme>('light-mode');

export function useTheme() {

  const toggleTheme = () => {
    const newTheme = theme.value === 'dark-mode' ? 'light-mode' : 'dark-mode';
    theme.value = newTheme;
    if (process.client) {
      document.documentElement.className = newTheme;
      localStorage.setItem('theme', newTheme);
    }
  };

  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme) {
        theme.value = savedTheme;
      } else {
        theme.value = 'light-mode';
      }
      document.documentElement.className = theme.value;
    }
  };
  
  // Ми запускаємо ініціалізацію один раз, коли composable використовується вперше
  onMounted(initTheme);

  return {
    theme: readonly(theme), // Надаємо доступ тільки для читання ззовні
    toggleTheme,
  };
}