import { UserCircle } from 'lucide-react';
import type { Role } from '../types';

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const roles: Role[] = ['admin', 'teacher', 'viewer'];

  return (
    <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg border border-yellow-300">
      <UserCircle className="w-5 h-5 text-yellow-700" />
      <span className="text-sm font-medium text-yellow-900">Dev Mode:</span>
      <select
        value={currentRole}
        onChange={(e) => onRoleChange(e.target.value as Role)}
        className="bg-white border border-yellow-300 rounded px-2 py-1 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
