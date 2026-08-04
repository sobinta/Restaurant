import React from 'react';
import { ArrowLeft, ArrowRight, Globe2, MoonStar, ShieldCheck, SunMedium } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { authCopy } from '../../auth/authCopy';

const languageLabels = { de: 'DE', en: 'EN', fa: 'FA', ar: 'AR' };

export default function AuthShell({ eyebrow = 'ARSHIDA CIRCLE', title, lead, children }) {
  const { lang, isRtl, toggleLanguage, themeMode, toggleThemeMode, branding } = useTheme();
  const copy = authCopy[lang] || authCopy.en;
  const nextLanguage = { de: 'en', en: 'fa', fa: 'ar', ar: 'de' }[lang];
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  return <main className="auth-page" id="main">
    <header className="auth-bar">
      <Link className="auth-brand" to="/" aria-label={copy.backHome}><span>A</span><b>{branding.name}</b></Link>
      <div className="auth-tools">
        <button onClick={() => toggleLanguage(nextLanguage)} aria-label="Change language"><Globe2 />{languageLabels[lang]}</button>
        <button onClick={() => toggleThemeMode()} aria-label="Change colour mode">{themeMode === 'dark' ? <SunMedium /> : <MoonStar />}</button>
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
