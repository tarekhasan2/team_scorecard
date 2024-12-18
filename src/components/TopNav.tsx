import React from 'react';
import { Target, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const TopNav: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Target className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Team Scorecard
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">
                  {user?.user_metadata.full_name || user?.email}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.user_metadata.roles?.[0]?.charAt(0).toUpperCase() + 
                   user?.user_metadata.roles?.[0]?.slice(1)}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};