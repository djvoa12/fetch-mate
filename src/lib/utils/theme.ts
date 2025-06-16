import { store } from '$lib/stores/app.svelte';

export function onToggleTheme() {
  const isDark = store.isDarkTheme;
  const newTheme = isDark ? 'light' : 'dark';
  document.querySelector('body')?.classList.toggle('dark', !isDark);
  localStorage.setItem('theme', newTheme);
  store.isDarkTheme = !isDark;
}

export function setTheme() {
  const themeValue = localStorage.getItem('theme');

  if (themeValue === 'light') {
    document.querySelector('html')?.classList.remove('dark');
    store.isDarkTheme = false;
  }
}
