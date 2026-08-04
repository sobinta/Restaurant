import React, { useState } from 'react';
import { ArrowRight, BellRing, CheckCircle2, LogOut, Settings2, ShieldCheck, UserRound, Workflow } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useTheme } from '../../context/ThemeContext';
import AppearancePreferences from './AppearancePreferences';
import { workspaceCopy } from '../workspace/workspaceCopy';
import { enablePushNotifications } from '../../notifications/push';

export default function AccountPage() {
  const { lang, branding } = useTheme();
  const copy = workspaceCopy[lang] || workspaceCopy.en;
  const auth = useAuth();
  const navigate = useNavigate();
  const [pushState, setPushState] = useState({ busy:false, message:'', success:false });
  const email = auth.user?.email || '';
  const name = auth.profile?.display_name || auth.user?.user_metadata?.display_name || email.split('@')[0];
  const hasWorkspaces = auth.memberships.length > 0 || auth.globalRoles.includes('superadmin');
  return <main className="account-page" id="main">
    <header className="account-topbar"><Link className="auth-brand" to="/"><span>A</span><b>{branding.name}</b></Link><button className="account-signout" onClick={async () => { await auth.signOut(); navigate('/'); }}><LogOut />{copy.signOut}</button></header>
    <section className="account-hero page-width"><div><span className="eyebrow">ARSHIDA CIRCLE · PRIVATE</span><h1>{copy.account}</h1><p>{copy.accountLead}</p></div><div className="account-identity"><span>{name?.slice(0, 1)?.toUpperCase() || 'A'}</span><div><b>{name}</b><small>{email}</small><i><CheckCircle2 />{copy.verified}</i></div></div></section>
    <section className="account-grid page-width">
      <article className="account-card account-profile-card"><header><UserRound /><span><b>{copy.profile}</b><small>Customer ID · {auth.user?.id?.slice(0, 8) || '—'}</small></span></header><dl><div><dt>Email</dt><dd>{email}</dd></div><div><dt>Locale</dt><dd>{auth.profile?.locale?.toUpperCase() || lang.toUpperCase()}</dd></div><div><dt>Status</dt><dd>{auth.status}</dd></div></dl></article>
      <article className="account-card account-workspace-card"><header><Workflow /><span><b>{copy.workspaces}</b><small>{copy.choose}</small></span></header>{hasWorkspaces ? <Link className="account-card-action" to="/workspaces">{copy.enter}<ArrowRight /></Link> : <div className="account-empty"><ShieldCheck /><b>{copy.noWorkspace}</b><p>{copy.noWorkspaceLead}</p></div>}</article>
      <article className="account-card account-notification-card"><header><BellRing /><span><b>{copy.notifications}</b><small>Realtime · Web Push</small></span></header><p>{copy.notificationLead}</p>{pushState.message && <p className={pushState.success ? 'form-success' : 'form-error'} role="status">{pushState.message}</p>}<button className="button button-ghost" disabled={pushState.busy} onClick={async () => { setPushState({busy:true,message:'',success:false}); try { await enablePushNotifications(); setPushState({busy:false,message:copy.notificationsEnabled,success:true}); } catch { setPushState({busy:false,message:copy.notificationsUnavailable,success:false}); } }}>{copy.enableNotifications}</button></article>
      <article className="account-card account-appearance-card"><header><Settings2 /><span><b>{copy.appearance}</b><small>Theme · Locale</small></span></header><AppearancePreferences /></article>
    </section>
  </main>;
}
