import React, { useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { useAuthStore } from '../store/authStore';
import { AUTH_CONFIG } from '../config/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    netlifyIdentity.init({
      container: '#netlify-modal',
      locale: 'en',
    });

    const handleLogin = (user: netlifyIdentity.User) => {
      setUser({
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.user_metadata?.full_name,
          roles: user.app_metadata?.roles || ['employee'],
        },
      });
      netlifyIdentity.close();
    };

    const handleLogout = () => {
      setUser(null);
    };

    const handleError = (err: Error) => {
      console.error('Netlify Identity Error:', err);
      setUser(null);
    };

    netlifyIdentity.on('login', handleLogin);
    netlifyIdentity.on('logout', handleLogout);
    netlifyIdentity.on('error', handleError);

    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      handleLogin(currentUser);
    }

    setInitialized(true);

    return () => {
      netlifyIdentity.off('login', handleLogin);
      netlifyIdentity.off('logout', handleLogout);
      netlifyIdentity.off('error', handleError);
    };
  }, [setUser, setInitialized]);

  return (
    <>
      {children}
      <div id="netlify-modal" />
    </>
  );
};