import React, { createContext, useContext, useState, useEffect } from 'react';
import { RESTAURANT_PRESETS } from '../data/mockData';
import { translations } from '../data/translations';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [lang, setLang] = useState('en'); // Default language is English (LTR)
  const [themeMode, setThemeMode] = useState('dark'); // 'dark' or 'light'
  
  const [currentPreset, setCurrentPreset] = useState(RESTAURANT_PRESETS[0]);
  const [branding, setBranding] = useState({
    name: "Arshida Luxury Dining",
    subName: "Fine Dining & Lounge",
    tagline: "Unforgettable Culinary Mastery & Immersive Dining",
    logoText: "ARSHIDA",
    badge: "2025 Best Luxury Award Winner"
  });
  
  const [presenterMode, setPresenterMode] = useState(true);
  const [currency, setCurrency] = useState('$');

  // Translation helper function
  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  // Sync html attributes on language or themeMode changes
  useEffect(() => {
    const isRtl = lang === 'fa';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Update theme class on body
    document.body.className = `theme-${themeMode} ${isRtl ? 'font-vazir' : 'font-sans'}`;
    
    // Update currency depending on lang
    if (lang === 'fa') {
      setCurrency('تومان');
    } else {
      setCurrency('$');
    }
  }, [lang, themeMode]);

  // When language changes, update default branding text if using default
  const toggleLanguage = (newLang) => {
    const selected = newLang || (lang === 'en' ? 'fa' : 'en');
    setLang(selected);
    if (selected === 'fa') {
      setBranding({
        name: "رستوران بین‌المللی آرشیدا",
        subName: "Arshida Fine Dining & Lounge",
        tagline: "تجربه‌ای ماندگار از طعم‌های شاهانه و فضایی مجلل",
        logoText: "رستوران آرشیدا",
        badge: "برنده تندیس برتر سال ۲۰۲۵"
      });
    } else {
      setBranding({
        name: "Arshida Luxury Dining",
        subName: "Fine Dining & Lounge",
        tagline: "Unforgettable Culinary Mastery & Immersive Dining",
        logoText: "ARSHIDA",
        badge: "2025 Best Luxury Award Winner"
      });
    }
  };

  const toggleThemeMode = (mode) => {
    const target = mode || (themeMode === 'dark' ? 'light' : 'dark');
    setThemeMode(target);
  };

  const updateBranding = (updatedFields) => {
    setBranding(prev => ({ ...prev, ...updatedFields }));
  };

  return (
    <ThemeContext.Provider value={{
      lang,
      toggleLanguage,
      themeMode,
      toggleThemeMode,
      t,
      currentPreset,
      setCurrentPreset,
      branding,
      updateBranding,
      presenterMode,
      setPresenterMode,
      currency,
      setCurrency
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
