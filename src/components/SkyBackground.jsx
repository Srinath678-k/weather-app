import { useEffect, useRef } from 'react';
import { getSkyTheme } from '../utils/skyTheme';

export function SkyBackground({ currentTimeStr, sunriseStr, sunsetStr, onThemeChange }) {
  const currentTheme = getSkyTheme(currentTimeStr, sunriseStr, sunsetStr);
  const prevThemeIdRef = useRef(null);

  useEffect(() => {
    // Apply CSS variables to document root for smooth full-page color transition
    const root = document.documentElement;
    root.style.setProperty('--bg-base', currentTheme.bgBase);
    root.style.setProperty('--bg-gradient', currentTheme.gradient);
    root.style.setProperty('--surface-card', currentTheme.card);
    root.style.setProperty('--surface-card-subtle', currentTheme.cardSubtle);
    root.style.setProperty('--surface-card-hover', currentTheme.cardHover);
    root.style.setProperty('--text-primary', currentTheme.text);
    root.style.setProperty('--text-secondary', currentTheme.textMuted);
    root.style.setProperty('--accent', currentTheme.accent);
    root.style.setProperty('--accent-bg', currentTheme.accentBg);
    root.style.setProperty('--border', currentTheme.border);
    root.style.setProperty('--tag-bg', currentTheme.tagBg);

    // Update browser theme-color meta tag for mobile address bar
    const metaThemeColor = document.getElementById('theme-color-meta');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', currentTheme.bgBase);
    }

    if (prevThemeIdRef.current !== currentTheme.id) {
      prevThemeIdRef.current = currentTheme.id;
      if (onThemeChange) {
        onThemeChange(currentTheme);
      }
    }
  }, [currentTheme, onThemeChange]);

  return null;
}
