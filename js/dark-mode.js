// js/dark-mode.js
// Dark Mode Toggle Funktionalität

const STORAGE_KEY = 'wb-mental-coach-theme';
const THEME_ATTRIBUTE = 'data-theme';

/**
 * Initialisiert den Dark Mode basierend auf gespeicherter Präferenz oder System-Präferenz
 */
export function initDarkMode() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(theme);
  
  // Höre auf System-Präferenz-Änderungen (nur wenn keine manuelle Präferenz gespeichert ist)
  if (!savedTheme) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    });
  }
}

/**
 * Setzt das Theme
 * @param {'light'|'dark'} theme
 */
export function setTheme(theme) {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  document.body.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(STORAGE_KEY, theme);
  
  // Update Toggle-Button falls vorhanden
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggle.title = theme === 'dark' ? 'Hell-Modus aktivieren' : 'Dunkel-Modus aktivieren';
  }
}

/**
 * Togglet zwischen Dark und Light Mode
 */
export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE) || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

/**
 * Erstellt einen Dark Mode Toggle Button
 * @returns {HTMLElement}
 */
export function createDarkModeToggle() {
  const button = document.createElement('button');
  button.id = 'darkModeToggle';
  button.className = 'dark-mode-toggle';
  button.type = 'button';
  button.setAttribute('aria-label', 'Dark Mode umschalten');
  button.setAttribute('aria-pressed', document.body.classList.contains('dark') ? 'true' : 'false');
  
  const currentTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE) || 'light';
  button.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  button.title = currentTheme === 'dark' ? 'Hell-Modus aktivieren' : 'Dunkel-Modus aktivieren';
  
  button.addEventListener('click', toggleTheme);
  
  return button;
}

// Initialisiere beim Laden
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
  initDarkMode();
}

