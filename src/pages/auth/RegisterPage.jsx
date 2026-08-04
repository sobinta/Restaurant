import React, { useState } from 'react';
import { ArrowRight, KeyRound, Mail, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authCopy, getAuthErrorMessage } from '../../auth/authCopy';
import { useAuth } from '../../auth/useAuth';
import { useTheme } from '../../context/ThemeContext';
import AuthFormStatus from './AuthFormStatus';
import AuthShell from './AuthShell';

export default function RegisterPage() {
  const { lang } = useTheme();
  const copy = authCopy[lang] || authCopy.en;
  const auth = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [formState, setFormState] = useState({ busy: false, error: '', success: '' });

  const submit = async (event) => {
    event.preventDefault();
    if (!auth.configured) return setFormState({ busy: false, error: copy.serviceUnavailable, success: '' });
    setFormState({ busy: true, error: '', success: '' });
    const { data, error } = await auth.signUp(form.email, form.password, form.name, lang);
    if (error) return setFormState({ busy: false, error: getAuthErrorMessage(error, copy), success: '' });
    setFormState({ busy: false, error: '', success: data.session ? copy.welcome : copy.confirmationSent });
  };

  return <AuthShell title={copy.createAccount} lead={copy.loginLead}>
    <form className="auth-form" onSubmit={submit}>
      <AuthFormStatus error={formState.error} success={formState.success} />
      <label><span>{copy.fullName}</span><div><UserRound /><input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div></label>
      <label><span>{copy.email}</span><div><Mail /><input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div></label>
      <label><span>{copy.password}</span><div><KeyRound /><input required minLength="8" type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div><small>{copy.passwordHint}</small></label>
      <button className="button button-primary auth-submit" disabled={formState.busy}>{formState.busy ? copy.creating : copy.register}<ArrowRight /></button>
      <p className="auth-switch">{copy.hasAccount} <Link to="/auth/login">{copy.signIn}</Link></p>
    </form>
  </AuthShell>;
}
