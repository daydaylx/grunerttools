import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Ensure the theme is applied immediately
const root = document.documentElement;
const savedTheme = localStorage.getItem('ui-storage');
if (savedTheme) {
  try {
    const { state } = JSON.parse(savedTheme);
    if (state?.theme) {
      if (state.theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(state.theme);
      }
    }
  } catch (error) {
    console.error('Failed to parse theme from localStorage:', error);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
