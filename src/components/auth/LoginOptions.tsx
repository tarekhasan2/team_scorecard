import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types/roles';
import { Shield, Users, UserCircle } from 'lucide-react';

const roleConfig: Record<Role, { title: string; description: string; icon: React.ReactNode }> = {
  admin: {
    title: 'Admin Access',
    description: 'Full access to all features and settings',
    icon: <Shield className="h-6 w-6 text-indigo-600" />
  },
  manager: {
    title: 'Manager Access',
    description: 'Access to team management and reports',
    icon: <Users className="h-6 w-6 text-indigo-600" />
  },
  employee: {
    title: 'Employee Access',
    description: 'Access to KPIs and entries',
    icon: <UserCircle className="h-6 w-6 text-indigo-600" />
  }
};

export const LoginOptions: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (role: Role) => {
    login(role);
  };

  return (
    <div className="space-y-4">
      {(Object.keys(roleConfig) as Role[]).map((role) => (
        <button
          key={role}
          onClick={() => handleLogin(role)}
          className="w-full flex items-center p-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <div className="flex-shrink-0">
            {roleConfig[role].icon}
          </div>
          <div className="ml-4 text-left">
            <p className="text-sm font-medium text-gray-900">
              {roleConfig[role].title}
            </p>
            <p className="text-sm text-gray-500">
              {roleConfig[role].description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};