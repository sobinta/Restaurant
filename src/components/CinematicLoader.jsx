import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { localize } from '../data/siteData';
import { pageCopy } from '../data/platformData';

export default function CinematicLoader({ onComplete }) {
  const { lang, branding } = useTheme();
  const [visible, setVisible] = useState(true);
  const completedRef = useRef(false);

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setVisible(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(complete, reduced ? 320 : 3400);
    return () => window.clearTimeout(timer);
  }, [complete]);

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
      <button onClick={complete}>{localize(pageCopy.skipIntro, lang)}</button>
    </div>
  );
}
