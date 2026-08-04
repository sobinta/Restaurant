import React from 'react';
import { ArrowRight, Building2, Crown, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useTheme } from '../../context/ThemeContext';
import RoleBadge from '../../components/workspace/RoleBadge';
import { rolePaths, workspaceCopy } from './workspaceCopy';

export default function WorkspaceSelectorPage() {
  const { lang } = useTheme();
  const copy = workspaceCopy[lang] || workspaceCopy.en;
  const auth = useAuth();
  const choices = auth.memberships.flatMap((membership) => membership.roles.map((role) => ({ ...membership, role })));
  return <main className="workspace-select-page"><header className="workspace-select-heading page-width"><Link to="/account">ARSHIDA · {copy.account}</Link><span className="eyebrow">SECURE OPERATIONS</span><h1>{copy.workspaces}</h1><p>{copy.choose}</p></header><section className="workspace-choice-grid page-width">
    {auth.globalRoles.includes('superadmin') && <Link className="workspace-choice is-global" to="/workspace/global/owner"><Crown /><div><small>GLOBAL</small><h2>{copy.superadmin}</h2><p>All branches · System scope</p></div><ArrowRight /></Link>}
    {choices.map((choice) => <Link className="workspace-choice" key={`${choice.branchId}-${choice.role}`} to={`/workspace/${choice.branchId}/${rolePaths[choice.role]}`}><Building2 /><div><small>{choice.branch?.name || copy.branch}</small><h2>{copy[choice.role] || choice.role}</h2><RoleBadge role={choice.role} label={choice.role.toUpperCase()} /></div><ArrowRight /></Link>)}
    {!choices.length && !auth.globalRoles.includes('superadmin') && <div className="workspace-empty"><ShieldCheck /><h2>{copy.noWorkspace}</h2><p>{copy.noWorkspaceLead}</p><Link className="button button-ghost" to="/account">{copy.backAccount}</Link></div>}
  </section></main>;
}
