export type Role = 'admin' | 'manager' | 'employee';

export interface RoleAccess {
  path: string;
  allowedRoles: Role[];
}

export const ROLE_ACCESS: RoleAccess[] = [
  { path: '/team', allowedRoles: ['admin', 'manager'] },
  { path: '/kpis', allowedRoles: ['admin', 'manager', 'employee'] },
  { path: '/kpi-entry', allowedRoles: ['admin', 'manager', 'employee'] },
  { path: '/reports', allowedRoles: ['admin', 'manager'] },
  { path: '/settings', allowedRoles: ['admin'] }
];