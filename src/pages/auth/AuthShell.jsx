import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Globe2, Palette, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { THEME_OPTIONS, useTheme } from '../../context/ThemeContext';
import { authCopy } from '../../auth/authCopy';

const languageLabels = { de: 'DE', en: 'EN', fa: 'FA', ar: 'AR' };

export default function AuthShell({ eyebrow = 'ARSHIDA CIRCLE', title, lead, children }) {
  const { lang, isRtl, toggleLanguage, themeId, setThemeId, branding } = useTheme();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const copy = authCopy[lang] || authCopy.en;
  const nextLanguage = { de: 'en', en: 'fa', fa: 'ar', ar: 'de' }[lang];
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  return <main className="auth-page" id="main">
    <header className="auth-bar">
      <Link className="auth-brand" to="/" aria-label={copy.backHome}><span>A</span><b>{branding.name}</b></Link>
      <div className="auth-tools">
        <button onClick={() => toggleLanguage(nextLanguage)} aria-label="Change language"><Globe2 />{languageLabels[lang]}</button>
        <div className="auth-preferences-anchor"><button onClick={() => setPreferencesOpen((value) => !value)} aria-label="Appearance" aria-expanded={preferencesOpen}><Palette /></button>{preferencesOpen && <div className="auth-preferences-popover">
          <div className="auth-mini-themes">{THEME_OPTIONS.map((theme) => <button key={theme.id} onClick={() => setThemeId(theme.id)} aria-pressed={theme.id === themeId}><span>{theme.colors.map((color) => <i key={color} style={{ background: color }} />)}</span><b>{theme.id.toUpperCase()}</b>{theme.id === themeId && <Check />}</button>)}</div>
          <div className="auth-mini-languages">{Object.entries(languageLabels).map(([code, label]) => <button key={code} className={code === lang ? 'active' : ''} onClick={() => toggleLanguage(code)}>{label}</button>)}</div>
        </div>}</div>
      </div>
    </header>
    <section className="auth-stage">
      <aside className="auth-atmosphere" aria-hidden="true">
        <div className="auth-orbit"><span>A</span></div>
        <p>CONTEMPORARY DINING<br />BERLIN · EST. 2026</p>
      </aside>
      <section className="auth-panel">
        <Link className="auth-back" to="/"><BackIcon />{copy.backHome}</Link>
        <div className="auth-heading"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{lead}</p></div>
        {children}
        <footer className="auth-trust"><ShieldCheck /><span>Supabase Auth · PKCE</span><small>Protected session</small></footer>
      </section>
    </section>
  </main>;
}
