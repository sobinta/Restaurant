import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { localize } from '../data/siteData';
import { pageCopy } from '../data/platformData';

export default function CinematicLoader() {
  const { lang, branding } = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setVisible(false), reduced ? 320 : 2200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;
  return (
    <div className="cinematic-loader" role="dialog" aria-label={branding.name} aria-modal="true">
      <div className="loader-grain" />
      <div className="loader-beam" />
      <div className="loader-title">
        <span className="loader-mark">A</span>
        <strong>{branding.name}</strong>
        <small>{branding.subName}</small>
      </div>
      <button onClick={() => setVisible(false)}>{localize(pageCopy.skipIntro, lang)}</button>
    </div>
  );
}
