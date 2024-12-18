import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Target, Shield, Users, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Target className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Team Scorecard Manager
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-6">
                Choose your role to continue
              </h3>
              <button
                onClick={login}
                className="w-full flex items-center justify-center px-4 py-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Sign in with Netlify Identity
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Available roles
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="flex items-center p-4 border border-gray-200 rounded-md">
                  <Shield className="h-6 w-6 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Admin</p>
                    <p className="text-sm text-gray-500">Full system access</p>
                  </div>
                </div>

                <div className="flex items-center p-4 border border-gray-200 rounded-md">
                  <Users className="h-6 w-6 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Manager</p>
                    <p className="text-sm text-gray-500">Team management access</p>
                  </div>
                </div>

                <div className="flex items-center p-4 border border-gray-200 rounded-md">
                  <UserCircle className="h-6 w-6 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Employee</p>
                    <p className="text-sm text-gray-500">KPI entry access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};