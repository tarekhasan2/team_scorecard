export type Role = 'admin' | 'manager' | 'user';

export type User = {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    roles?: Role[];
  };
};

export type EmployeeStatus = 'active' | 'inactive';

export type Employee = {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  startDate: string;
  endDate?: string;
  status: EmployeeStatus;
  salary: number;
  superannuation: {
    contribution: number;
  };
  bonusPotential: number;
  totalPackage: number;
  managerId?: string;
  kpis: string[];
};

export type KPIStatus = 'active' | 'inactive';
export type TimePeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type KPI = {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  unit: 'number' | 'percentage' | 'currency';
  preferredTrend: 'higher' | 'lower';
  timePeriod: TimePeriod;
  status: KPIStatus;
  startDate: string;
  endDate?: string;
  assignedEmployees: string[];
  createdAt: string;
  updatedAt: string;
};

export type KPIEntry = {
  id: string;
  kpiId: string;
  employeeId: string;
  value: number;
  week: string;
  notes?: string;
  createdAt: string;
};

export type WeeklyEntry = {
  id: string;
  employeeId: string;
  week: string;
  kpiEntries: {
    kpiId: string;
    value: number;
  }[];
  performanceRating: number;
  ratingJustification: string;
  capacityPercentage: number;
  capacityFactors?: string;
  weeklyReflection?: string;
  supportNeeded?: string;
  createdAt: string;
};