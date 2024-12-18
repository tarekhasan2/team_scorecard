import React from 'react';
import { Users, Target, BarChart3, Settings, ClipboardCheck } from 'lucide-react';
import { SidebarLink } from './SidebarLink';
import { useAuth } from '../hooks/useAuth';
import { ROLE_ACCESS } from '../types/roles';

export const Sidebar: React.FC = () => {
  const { user, hasAnyRole } = useAuth();
  const userRoles = user?.user_metadata.roles || [];

  const links = [
    {
      icon: Target,
      label: 'KPIs',
      href: '/kpis',
      show: true
    },
    {
      icon: ClipboardCheck,
      label: 'KPI Entry',
      href: '/kpi-entry',
      show: true
    },
    {
      icon: Users,
      label: 'Team Members',
      href: '/team',
      show: hasAnyRole(['admin', 'manager'])
    },
    {
      icon: BarChart3,
      label: 'Reports',
      href: '/reports',
      show: hasAnyRole(['admin', 'manager'])
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      show: hasAnyRole(['admin'])
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-5 px-2">
        {links.filter(link => link.show).map((link) => (
          <SidebarLink
            key={link.href}
            icon={link.icon}
            label={link.label}
            href={link.href}
          />
        ))}
      </nav>
    </aside>
  );
};