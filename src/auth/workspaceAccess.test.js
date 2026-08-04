import { describe, expect, it } from 'vitest';
import { hasWorkspaceRole } from './workspaceAccess';

const access = {
  globalRoles: ['customer'],
  memberships: [
    { branchId: 'mitte', status: 'active', roles: ['waiter', 'cashier'] },
    { branchId: 'west', status: 'suspended', roles: ['manager'] },
  ],
};

describe('hasWorkspaceRole', () => {
  it('allows an active matching branch role', () => expect(hasWorkspaceRole(access, 'mitte', ['waiter'])).toBe(true));
  it('denies a role from another branch', () => expect(hasWorkspaceRole(access, 'west', ['waiter'])).toBe(false));
  it('denies suspended memberships', () => expect(hasWorkspaceRole(access, 'west', ['manager'])).toBe(false));
  it('allows superadmin globally when explicitly accepted', () => expect(hasWorkspaceRole({ globalRoles: ['superadmin'], memberships: [] }, 'global', ['manager', 'superadmin'])).toBe(true));
  it('does not infer permission from a customer role', () => expect(hasWorkspaceRole(access, 'mitte', ['kitchen'])).toBe(false));
});
