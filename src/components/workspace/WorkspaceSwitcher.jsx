import React from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../auth/useAuth';
import { rolePaths, workspaceCopy } from '../../pages/workspace/workspaceCopy';

export default function WorkspaceSwitcher({ branchId, role }) {
  const { lang } = useTheme();
  const copy = workspaceCopy[lang] || workspaceCopy.en;
  const { memberships } = useAuth();
  const options = memberships.flatMap((membership) => membership.roles.map((item) => ({ ...membership, role: item })));
  const navigate = useNavigate();
  const current = options.find((item) => item.branchId === branchId && item.role === role);
  return <label className="workspace-switcher"><Building2 /><span><small>{copy.branch}</small><b>{current?.branch?.name || copy.workspaces}</b></span><select aria-label={copy.workspaces} value={current ? `${current.branchId}:${current.role}` : ''} onChange={(event) => {
    const [nextBranch, nextRole] = event.target.value.split(':');
    if (nextBranch && rolePaths[nextRole]) navigate(`/workspace/${nextBranch}/${rolePaths[nextRole]}`);
  }}><option value="" disabled>{copy.choose}</option>{options.map((option) => <option key={`${option.branchId}:${option.role}`} value={`${option.branchId}:${option.role}`}>{option.branch?.name} · {copy[option.role] || option.role}</option>)}</select><ChevronDown /></label>;
}
