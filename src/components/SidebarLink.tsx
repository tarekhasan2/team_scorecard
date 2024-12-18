import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, label, href }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-gray-100 text-indigo-600'
          : 'text-gray-900 hover:bg-gray-50 hover:text-indigo-600'
      }`}
    >
      <Icon className={`mr-3 h-6 w-6 ${
        isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'
      }`} />
      {label}
    </Link>
  );
};