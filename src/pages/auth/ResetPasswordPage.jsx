import React, { useState } from 'react';
import { ArrowRight, KeyRound } from 'lucide-react';
import { authCopy, getAuthErrorMessage } from '../../auth/authCopy';
import { useAuth } from '../../auth/useAuth';
import { useTheme } from '../../context/ThemeContext';
import AuthFormStatus from './AuthFormStatus';
import AuthShell from './AuthShell';

export default function ResetPasswordPage() {
  const { lang } = useTheme();
  const copy = authCopy[lang] || authCopy.en;
  const auth = useAuth();
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState({ busy: false, error: '', success: '' });
  const submit = async (event) => {
    event.preventDefault();
    if (!auth.isAuthenticated) return setFormState({ busy: false, error: copy.callbackError, success: '' });
    setFormState({ busy: true, error: '', success: '' });
    const { error } = await auth.updatePassword(password);
    setFormState(error
      ? { busy: false, error: getAuthErrorMessage(error, copy), success: '' }
      : { busy: false, error: '', success: copy.passwordSaved });
  };
  return <AuthShell title={copy.resetTitle} lead={copy.passwordHint}>
    <form className="auth-form" onSubmit={submit}>
      <AuthFormStatus error={formState.error} success={formState.success} />
      <label><span>{copy.newPassword}</span><div><KeyRound /><input required minLength="8" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div></label>
      <button className="button button-primary auth-submit" disabled={formState.busy || auth.isLoading}>{formState.busy ? copy.saving : copy.savePassword}<ArrowRight /></button>
    </form>
  </AuthShell>;
}
