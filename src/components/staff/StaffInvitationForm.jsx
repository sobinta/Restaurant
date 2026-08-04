import React, { useState } from 'react';
import { Check, Mail, Send } from 'lucide-react';
import { inviteStaffMember } from '../../api/staffAccess';

const staffRoles = ['waiter', 'kitchen', 'cashier', 'delivery', 'manager'];

export default function StaffInvitationForm({ branchId, canInviteManager, labels, onCreated }) {
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState(['waiter']);
  const [state, setState] = useState({ busy: false, error: '', success: '' });
  const available = canInviteManager ? staffRoles : staffRoles.filter((role) => role !== 'manager');
  const toggle = (role) => setRoles((current) => current.includes(role) ? current.filter((item) => item !== role) : [...current, role]);
  const submit = async (event) => {
    event.preventDefault();
    if (!roles.length) return setState({ busy: false, error: labels.roleRequired, success: '' });
    setState({ busy: true, error: '', success: '' });
    try {
      await inviteStaffMember({ branchId, email, roles });
      setState({ busy: false, error: '', success: labels.invitationSent });
      setEmail(''); setRoles(['waiter']); onCreated?.();
    } catch { setState({ busy: false, error: labels.actionFailed, success: '' }); }
  };
  return <form className="staff-invite-form" onSubmit={submit}>
    <label><span>{labels.email}</span><div><Mail /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></div></label>
    <fieldset><legend>{labels.roles}</legend><div>{available.map((role) => <button type="button" key={role} className={roles.includes(role) ? 'active' : ''} onClick={() => toggle(role)}>{roles.includes(role) && <Check />}{labels[role]}</button>)}</div></fieldset>
    {(state.error || state.success) && <p className={state.error ? 'form-error' : 'form-success'} role="status">{state.error || state.success}</p>}
    <button className="button button-primary" disabled={state.busy}>{state.busy ? labels.sending : <><Send />{labels.invite}</>}</button>
  </form>;
}
