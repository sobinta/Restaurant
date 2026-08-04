import React, { useEffect, useState } from 'react';
import { ArrowRight, KeyRound, Mail } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authCopy, getAuthErrorMessage } from '../../auth/authCopy';
import { sanitizeReturnPath } from '../../auth/authRoutes';
import { useAuth } from '../../auth/useAuth';
import { useTheme } from '../../context/ThemeContext';
import AuthFormStatus from './AuthFormStatus';
import AuthShell from './AuthShell';

export default function LoginPage() {
  const { lang } = useTheme();
  const copy = authCopy[lang] || authCopy.en;
  const auth = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnTo = sanitizeReturnPath(params.get('returnTo'));
  const [form, setForm] = useState({ email: '', password: '' });
  const [formState, setFormState] = useState({ busy: '', error: '', success: '' });

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) navigate(returnTo, { replace: true });
  }, [auth.isAuthenticated, auth.isLoading, navigate, returnTo]);

  const submit = async (event) => {
    event.preventDefault();
    if (!auth.configured) return setFormState({ busy: '', error: copy.serviceUnavailable, success: '' });
    setFormState({ busy: 'password', error: '', success: '' });
    const { error } = await auth.signIn(form.email, form.password);
    if (error) setFormState({ busy: '', error: getAuthErrorMessage(error, copy), success: '' });
  };

  const magic = async () => {
    if (!form.email) return setFormState({ busy: '', error: copy.genericError, success: '' });
    if (!auth.configured) return setFormState({ busy: '', error: copy.serviceUnavailable, success: '' });
    setFormState({ busy: 'magic', error: '', success: '' });
    const { error } = await auth.sendMagicLink(form.email);
    setFormState(error
      ? { busy: '', error: getAuthErrorMessage(error, copy), success: '' }
      : { busy: '', error: '', success: copy.confirmationSent });
  };

  return <AuthShell title={copy.welcome} lead={copy.loginLead}>
    <form className="auth-form" onSubmit={submit}>
      <AuthFormStatus error={formState.error} success={formState.success} />
      <label><span>{copy.email}</span><div><Mail /><input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div></label>
      <label><span>{copy.password}</span><div><KeyRound /><input required minLength="8" type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div></label>
      <Link className="auth-text-action" to="/auth/forgot-password">{copy.forgot}</Link>
      <button className="button button-primary auth-submit" disabled={Boolean(formState.busy)}>{formState.busy === 'password' ? copy.signingIn : copy.signIn}<ArrowRight /></button>
      <div className="auth-divider"><i /><span>{copy.or}</span><i /></div>
      <button className="button button-ghost auth-submit" type="button" disabled={Boolean(formState.busy)} onClick={magic}>{formState.busy === 'magic' ? copy.sending : copy.magic}</button>
      <p className="auth-switch">{copy.noAccount} <Link to="/auth/register">{copy.createAccount}</Link></p>
    </form>
  </AuthShell>;
}
