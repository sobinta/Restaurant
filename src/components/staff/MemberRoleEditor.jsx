import React, { useState } from 'react';
import { Check, PauseCircle, PlayCircle, Save } from 'lucide-react';
import { setMemberStatus, updateMemberRoles } from '../../api/staffAccess';

const staffRoles = ['waiter', 'kitchen', 'cashier', 'delivery', 'manager'];

export default function MemberRoleEditor({ member, canManageManager, labels, onChanged }) {
  const [roles, setRoles] = useState(member.roles);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const isManager = member.roles.includes('manager');
  const locked = isManager && !canManageManager;
  const available = canManageManager ? staffRoles : staffRoles.filter((role) => role !== 'manager');
  const toggle = (role) => setRoles((current) => current.includes(role) ? current.filter((item) => item !== role) : [...current, role]);
  const save = async () => {
    if (!roles.length || locked) return;
    setBusy('roles'); setError('');
    try { await updateMemberRoles(member.id, roles); onChanged?.(); } catch { setError(labels.actionFailed); } finally { setBusy(''); }
  };
  const status = async () => {
    if (locked) return;
    setBusy('status'); setError('');
    try { await setMemberStatus(member.id, member.status === 'active' ? 'suspended' : 'active'); onChanged?.(); } catch { setError(labels.actionFailed); } finally { setBusy(''); }
  };
  return <article className={`staff-member ${member.status !== 'active' ? 'is-suspended' : ''}`}><header><span>{member.name?.slice(0,1)?.toUpperCase() || '?'}</span><div><b>{member.name}</b><small>{member.email}</small></div><i>{labels[member.status] || member.status}</i></header><div className="staff-role-controls">{available.map((role) => <button type="button" key={role} disabled={locked} className={roles.includes(role) ? 'active' : ''} onClick={() => toggle(role)}>{roles.includes(role) && <Check />}{labels[role]}</button>)}</div>{error && <p className="form-error" role="alert">{error}</p>}<footer><button disabled={busy || locked || !roles.length} onClick={save}><Save />{labels.saveRoles}</button><button disabled={busy || locked} onClick={status}>{member.status === 'active' ? <PauseCircle /> : <PlayCircle />}{member.status === 'active' ? labels.suspend : labels.activate}</button></footer></article>;
}
