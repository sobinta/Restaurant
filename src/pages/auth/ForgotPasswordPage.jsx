import React, { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { authCopy, getAuthErrorMessage } from '../../auth/authCopy';
import { useAuth } from '../../auth/useAuth';
import { useTheme } from '../../context/ThemeContext';
import AuthFormStatus from './AuthFormStatus';
import AuthShell from './AuthShell';

export default function ForgotPasswordPage() {
  const { lang } = useTheme();
  const copy = authCopy[lang] || authCopy.en;
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState({ busy: false, error: '', success: '' });
  const submit = async (event) => {
    event.preventDefault();
    if (!auth.configured) return setFormState({ busy: false, error: copy.serviceUnavailable, success: '' });
    setFormState({ busy: true, error: '', success: '' });
    const { error } = await auth.requestPasswordReset(email);
    setFormState(error
      ? { busy: false, error: getAuthErrorMessage(error, copy), success: '' }
      : { busy: false, error: '', success: copy.confirmationSent });
  };
  return <AuthShell title={copy.forgotTitle} lead={copy.forgotLead}>
    <form className="auth-form" onSubmit={submit}>
      <AuthFormStatus error={formState.error} success={formState.success} />
      <label><span>{copy.email}</span><div><Mail /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></div></label>
      <button className="button button-primary auth-submit" disabled={formState.busy}>{formState.busy ? copy.sending : copy.sendReset}<ArrowRight /></button>
    </form>
  </AuthShell>;
}
