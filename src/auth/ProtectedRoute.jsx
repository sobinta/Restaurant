import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from './useAuth';
import { authPath } from './authRoutes';
import { hasWorkspaceRole } from './workspaceAccess';

export default function ProtectedRoute({ children, roles = [], globalOnly = false }) {
  const auth = useAuth();
  const location = useLocation();
  const { branchId } = useParams();

  if (auth.isLoading) return <div className="auth-route-loading" role="status"><span>A</span><p>Securing your workspace…</p></div>;
  if (!auth.isAuthenticated) return <Navigate replace to={authPath('/auth/login', `${location.pathname}${location.search}`)} />;
  if (auth.status === 'suspended') return <Navigate replace to="/forbidden?reason=suspended" />;
  if (!roles.length) return children;

  return hasWorkspaceRole(auth, branchId, roles, globalOnly) ? children : <Navigate replace to="/forbidden" />;
}
