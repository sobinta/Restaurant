import React from 'react';
import { useAuth } from './useAuth';

export default function PermissionGate({ roles, branchId, fallback = null, children }) {
  const { globalRoles, memberships } = useAuth();
  const allowed = roles.some((role) => globalRoles.includes(role)) || memberships.some((membership) => (
    membership.branchId === branchId && membership.roles.some((role) => roles.includes(role))
  ));
  return allowed ? children : fallback;
}
