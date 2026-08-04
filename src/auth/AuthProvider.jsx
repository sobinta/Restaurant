/* eslint-disable react/only-export-components */
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPublicAppUrl, supabaseConfig } from '../lib/env';
import { supabase } from '../lib/supabase';
import { useMembershipRealtime } from '../realtime/useMembershipRealtime';

export const AuthContext = createContext(null);

const emptyAccess = { profile: null, globalRoles: [], memberships: [] };

const normalizeMemberships = (rows = []) => rows.map((membership) => ({
  id: membership.id,
  branchId: membership.branch_id,
  status: membership.status,
  branch: membership.branches,
  roles: (membership.branch_membership_roles || []).map((item) => item.role_key),
}));

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [access, setAccess] = useState(emptyAccess);
  const [status, setStatus] = useState(supabase ? 'loading' : 'unconfigured');
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const clearAccess = useCallback(() => setAccess(emptyAccess), []);

  const loadAccess = useCallback(async (activeSession) => {
    const id = ++requestId.current;
    if (!supabase || !activeSession?.user) {
      clearAccess();
      setStatus(supabase ? 'signed-out' : 'unconfigured');
      return;
    }

    setStatus('loading-access');
    setError(null);
    const userId = activeSession.user.id;
    const [profileResult, rolesResult, membershipsResult] = await Promise.all([
      supabase.from('profiles').select('id, display_name, phone, avatar_path, locale, status, onboarding_completed_at').eq('id', userId).maybeSingle(),
      supabase.from('user_global_roles').select('role_key').eq('user_id', userId),
      supabase.from('branch_memberships').select('id, branch_id, status, branches(id, slug, name, timezone, locale, currency), branch_membership_roles(role_key)').eq('user_id', userId).eq('status', 'active'),
    ]);

    if (id !== requestId.current) return;
    const accessError = profileResult.error || rolesResult.error || membershipsResult.error;
    if (accessError) {
      setError(accessError);
      setAccess(emptyAccess);
      setStatus('error');
      return;
    }

    setAccess({
      profile: profileResult.data,
      globalRoles: (rolesResult.data || []).map((item) => item.role_key),
      memberships: normalizeMemberships(membershipsResult.data),
    });
    setStatus(profileResult.data?.status === 'suspended' ? 'suspended' : 'signed-in');
  }, [clearAccess]);

  useEffect(() => {
    if (!supabase) return undefined;
    let mounted = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError) {
        setError(sessionError);
        setStatus('error');
        return;
      }
      setSession(data.session);
      void loadAccess(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      window.setTimeout(() => { if (mounted) void loadAccess(nextSession); }, 0);
    });

    return () => {
      mounted = false;
      requestId.current += 1;
      listener.subscription.unsubscribe();
    };
  }, [loadAccess]);

  const redirectTo = useCallback((path) => `${getPublicAppUrl()}${path}`, []);
  const unavailable = useCallback(() => Promise.resolve({ data: null, error: new Error('SUPABASE_NOT_CONFIGURED') }), []);
  const actions = useMemo(() => ({
    signIn: (email, password) => supabase ? supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password }) : unavailable(),
    signUp: (email, password, displayName, locale) => supabase ? supabase.auth.signUp({
      email: email.trim().toLowerCase(), password,
      options: { emailRedirectTo: redirectTo('/auth/callback'), data: { display_name: displayName.trim(), locale } },
    }) : unavailable(),
    sendMagicLink: (email) => supabase ? supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(), options: { emailRedirectTo: redirectTo('/auth/callback') },
    }) : unavailable(),
    requestPasswordReset: (email) => supabase ? supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: redirectTo('/auth/reset-password') }) : unavailable(),
    updatePassword: (password) => supabase ? supabase.auth.updateUser({ password }) : unavailable(),
    signOut: () => supabase ? supabase.auth.signOut({ scope: 'local' }) : unavailable(),
    refreshAccess: () => loadAccess(session),
  }), [loadAccess, redirectTo, session, unavailable]);

  useMembershipRealtime(session?.user?.id, () => loadAccess(session));

  const value = useMemo(() => ({
    configured: supabaseConfig.configured,
    session,
    user: session?.user || null,
    ...access,
    status,
    error,
    isLoading: status === 'loading' || status === 'loading-access',
    isAuthenticated: Boolean(session?.user),
    ...actions,
  }), [session, access, status, error, actions]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
