import { requireSupabase } from '../lib/supabase';

const invoke = async (name, body) => {
  const { data, error } = await requireSupabase().functions.invoke(name, { body });
  if (error) throw error;
  return data;
};

export const inviteStaffMember = (input) => invoke('invite-staff-member', input);
export const acceptStaffInvitation = (token) => invoke('accept-staff-invitation', { token });
export const updateMemberRoles = (membershipId, roles) => invoke('update-member-roles', { membershipId, roles });
export const setMemberStatus = (membershipId, status) => invoke('suspend-branch-member', { membershipId, status });
