import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthFormStatus({ error, success }) {
  if (!error && !success) return null;
  return <div className={`auth-form-status ${error ? 'is-error' : 'is-success'}`} role={error ? 'alert' : 'status'}>
    {error ? <AlertCircle /> : <CheckCircle2 />}
    <span>{error || success}</span>
  </div>;
}
