import { Role } from '../types/roles';

export const AUTH_CONFIG = {
  // This should be your Netlify site URL
  siteURL: window.location.origin,
  roles: ['admin', 'manager', 'employee'] as Role[],
};