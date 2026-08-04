import React from 'react';
import { BadgeEuro, Bike, ChefHat, Construction, Crown, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import WorkspaceSwitcher from '../../components/workspace/WorkspaceSwitcher';
import { useAuth } from '../../auth/useAuth';
import { workspaceCopy } from './workspaceCopy';

const roleMeta = {
  waiter: { icon: UtensilsCrossed, code: 'FOH' }, kitchen: { icon: ChefHat, code: 'KDS' }, cashier: { icon: BadgeEuro, code: 'POS' }, delivery: { icon: Bike, code: 'DSP' }, manager: { icon: ShieldCheck, code: 'MGR' }, superadmin: { icon: Crown, code: 'ROOT' },
};

export default function WorkspaceShell({ role }) {
  const { branchId } = useParams();
  const { lang } = useTheme();
  const { globalRoles } = useAuth();
  const copy = workspaceCopy[lang] || workspaceCopy.en;
  const effectiveRole = branchId === 'global' && globalRoles.includes('superadmin') ? 'superadmin' : role;
  const meta = roleMeta[effectiveRole] || roleMeta.manager;
  const Icon = meta.icon;
  return <main className="workspace-shell-page"><header className="workspace-shell-bar"><Link to="/">ARSHIDA</Link><WorkspaceSwitcher branchId={branchId} role={effectiveRole} /><Link to="/account">{copy.account}</Link></header><section className="workspace-shell-stage page-width"><span className="workspace-code">{meta.code}</span><div className="workspace-shell-icon"><Icon /></div><span className="eyebrow">SECURE WORKSPACE · {branchId === 'global' ? 'GLOBAL' : copy.branch}</span><h1>{copy[effectiveRole]}</h1><p>{copy.coming}</p><div className="workspace-coming"><Construction /><span>Foundation active</span><b>Realtime-ready · RLS protected</b></div></section></main>;
}
