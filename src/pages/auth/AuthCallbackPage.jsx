import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authCopy } from '../../auth/authCopy';
import { sanitizeReturnPath } from '../../auth/authRoutes';
import { useAuth } from '../../auth/useAuth';
import { useTheme } from '../../context/ThemeContext';
import AuthFormStatus from './AuthFormStatus';
import AuthShell from './AuthShell';

export default function AuthCallbackPage() {
  const { lang } = useTheme();
  const copy = authCopy[lang] || authCopy.en;
  const auth = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const error = params.get('error_description');
  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) navigate(sanitizeReturnPath(params.get('returnTo')), { replace: true });
  }, [auth.isAuthenticated, auth.isLoading, navigate, params]);
  return <AuthShell title={copy.callbackTitle} lead={copy.loginLead}>
    <div className="auth-callback-card">
      {error || auth.status === 'error' || auth.status === 'signed-out' ? <AuthFormStatus error={copy.callbackError} /> : <div className="auth-spinner" role="status"><span /><small>{copy.callbackTitle}</small></div>}
    </div>
  </AuthShell>;
}
