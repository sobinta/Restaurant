export const hasWorkspaceRole = ({ globalRoles = [], memberships = [] }, branchId, roles = [], globalOnly = false) => {
  if (!roles.length) return true;
  if (roles.some((role) => globalRoles.includes(role))) return true;
  if (globalOnly) return false;
  return memberships.some((membership) => (
    membership.branchId === branchId
    && membership.status === 'active'
    && membership.roles.some((role) => roles.includes(role))
  ));
};
