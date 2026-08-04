import React from 'react';
import { Check, Globe2, Palette } from 'lucide-react';
import { THEME_OPTIONS, useTheme } from '../../context/ThemeContext';

const languages = { de: 'Deutsch', en: 'English', fa: 'فارسی', ar: 'العربية' };

export default function AppearancePreferences() {
  const { lang, toggleLanguage, themeId, setThemeId } = useTheme();
  return <div className="account-preferences">
    <div className="account-preference-heading"><Palette /><span>8 themes</span></div>
    <div className="account-theme-grid">{THEME_OPTIONS.map((theme) => <button key={theme.id} onClick={() => setThemeId(theme.id)} aria-pressed={theme.id === themeId}><span>{theme.colors.map((color) => <i key={color} style={{ background: color }} />)}</span><b>{theme.id.toUpperCase()}</b>{theme.id === themeId && <Check />}</button>)}</div>
    <div className="account-preference-heading"><Globe2 /><span>Language</span></div>
    <div className="account-language-grid">{Object.entries(languages).map(([code, label]) => <button key={code} className={code === lang ? 'active' : ''} onClick={() => toggleLanguage(code)}>{label}{code === lang && <Check />}</button>)}</div>
  </div>;
}
