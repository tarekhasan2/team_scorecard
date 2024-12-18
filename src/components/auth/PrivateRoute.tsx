import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && (!user.user_metadata.roles?.includes(requiredRole))) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Unauthorized Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              You don't have permission to access this page. Please contact your administrator.
            </p>
          </div>
          <div className="mt-6">
            <Navigate to="/" replace />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};