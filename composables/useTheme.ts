import { ref, onMounted, readonly } from 'vue';

type Theme = 'light' | 'dark';

const theme = ref<Theme>('light');

export function useTheme() {
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      document.documentElement.className = 'light';
    }
  });

  return {
    theme: readonly(theme),
    toggleTheme,
  };
}