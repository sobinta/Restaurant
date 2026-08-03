/* eslint-disable react/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../data/translations';

const ThemeContext = createContext(null);

export const THEME_OPTIONS = [
  { id: 'd1', family: 'dark', page: '#12130F', label: 'Obsidian · Saffron', colors: ['#12130F', '#3D422E', '#D7A84B'] },
  { id: 'd2', family: 'dark', page: '#1D101B', label: 'Black Plum · Rose', colors: ['#1D101B', '#672F4F', '#DD8B72'] },
  { id: 'd3', family: 'dark', page: '#091B17', label: 'Night Forest · Amber', colors: ['#091B17', '#24624E', '#D49A55'] },
  { id: 'd4', family: 'dark', page: '#08111D', label: 'Midnight Ink · Champagne', colors: ['#08111D', '#274C67', '#D4BD87'] },
  { id: 'l1', family: 'light', page: '#EEF0E7', label: 'Pearl · Sage', colors: ['#FBFCF6', '#DFE4CF', '#B87916'] },
  { id: 'l2', family: 'light', page: '#F5EDEF', label: 'Oyster · Smoky Rose', colors: ['#FFF9F8', '#EAD9DF', '#B85063'] },
  { id: 'l3', family: 'light', page: '#E8F0EC', label: 'Green Mist · Jade', colors: ['#F8FCFA', '#D4E6DF', '#BF6B2F'] },
  { id: 'l4', family: 'light', page: '#E9EEF3', label: 'Ice · Steel Blue', colors: ['#F8FBFD', '#D6E0EB', '#923947'] },
];

const safeRead = (key, fallback) => {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
};

export function ThemeProvider({ children }) {
  const [lang, setLang] = useState(() => safeRead('arshida-language', 'de'));
  const [themeId, setThemeIdState] = useState(() => safeRead('arshida-theme', 'd2'));
  const [layoutMode, setLayoutModeState] = useState(() => safeRead('arshida-layout', 'cinematic'));
  const [branding, setBranding] = useState({
    name: 'ARSHIDA',
    subName: 'Contemporary Dining · Berlin',
    tagline: '',
    logoText: 'ARSHIDA',
    badge: 'Chef’s Table Selection 2026',
  });

  const isRtl = lang === 'fa' || lang === 'ar';
  const theme = THEME_OPTIONS.find((item) => item.id === themeId) || THEME_OPTIONS[1];
  const themeMode = theme.family;

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = isRtl ? 'rtl' : 'ltr';
    root.dataset.theme = themeId;
    root.dataset.layout = layoutMode;
    document.body.className = `theme-${themeMode} theme-${themeId} ${isRtl ? 'is-rtl' : 'is-ltr'}`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.page);
    try {
      localStorage.setItem('arshida-language', lang);
      localStorage.setItem('arshida-theme', themeId);
      localStorage.setItem('arshida-layout', layoutMode);
    } catch { /* Preferences remain session-only when storage is unavailable. */ }
  }, [lang, themeId, layoutMode, themeMode, isRtl, theme.page]);

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;
  const toggleLanguage = (next) => setLang(next || (lang === 'de' ? 'en' : 'de'));
  const setThemeId = (next) => {
    if (THEME_OPTIONS.some((item) => item.id === next)) setThemeIdState(next);
  };
  const toggleThemeMode = (mode) => {
    if (mode === 'light') setThemeIdState('l2');
    else if (mode === 'dark') setThemeIdState('d2');
    else setThemeIdState(themeMode === 'dark' ? 'l2' : 'd2');
  };
  const setLayoutMode = (next) => {
    if (next === 'cinematic' || next === 'editorial') setLayoutModeState(next);
  };

  const value = {
    lang,
    isRtl,
    toggleLanguage,
    themeId,
    setThemeId,
    themeMode,
    toggleThemeMode,
    themeOptions: THEME_OPTIONS,
    layoutMode,
    setLayoutMode,
    t,
    branding,
    updateBranding: (fields) => setBranding((current) => ({ ...current, ...fields })),
    currentPreset: null,
    setCurrentPreset: () => {},
    presenterMode: false,
    setPresenterMode: () => {},
    currency: '€',
    setCurrency: () => {},
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
