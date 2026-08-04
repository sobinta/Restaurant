import React from 'react';
import { LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { workspaceCopy } from './workspaceCopy';

export default function ForbiddenPage() {
  const { lang } = useTheme();
  const copy = workspaceCopy[lang] || workspaceCopy.en;
  return <main className="forbidden-page"><div><LockKeyhole /><span className="eyebrow">403 · ROLE BOUNDARY</span><h1>{copy.forbidden}</h1><p>{copy.forbiddenLead}</p><Link className="button button-primary" to="/account">{copy.backAccount}</Link></div></main>;
}
