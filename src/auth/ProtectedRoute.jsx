import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from './useAuth';
import { authPath } from './authRoutes';

export default function ProtectedRoute({ children, roles = [], globalOnly = false }) {
  const auth = useAuth();
  const location = useLocation();
  const { branchId } = useParams();

  if (auth.isLoading) return <div className="auth-route-loading" role="status"><span>A</span><p>Securing your workspace…</p></div>;
  if (!auth.isAuthenticated) return <Navigate replace to={authPath('/auth/login', `${location.pathname}${location.search}`)} />;
  if (auth.status === 'suspended') return <Navigate replace to="/forbidden?reason=suspended" />;
  if (!roles.length) return children;

  const hasGlobalRole = roles.some((role) => auth.globalRoles.includes(role));
  const membership = !globalOnly && auth.memberships.find((item) => item.branchId === branchId && item.roles.some((role) => roles.includes(role)));
  return hasGlobalRole || membership ? children : <Navigate replace to="/forbidden" />;
}
