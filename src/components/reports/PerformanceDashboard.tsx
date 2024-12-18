import React from 'react';
import { useWeeklyEntryStore } from '../../store/weeklyEntryStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { DashboardCard } from '../dashboard/DashboardCard';
import { Users, Target, TrendingUp, Percent } from 'lucide-react';

interface PerformanceDashboardProps {
  filters: {
    department: string;
    startDate: string;
    endDate: string;
    manager: string;
  };
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ filters }) => {
  const entries = useWeeklyEntryStore((state) => state.entries);
  const employees = useEmployeeStore((state) => state.employees);

  // Calculate metrics based on filters
  const calculateMetrics = () => {
    const filteredEntries = entries.filter(entry => {
      const employee = employees.find(emp => emp.id === entry.employeeId);
      if (!employee) return false;

      if (filters.department && employee.department !== filters.department) return false;
      if (filters.manager && employee.managerId !== filters.manager) return false;
      // Add date filtering logic here

      return true;
    });

    const avgRating = filteredEntries.reduce((acc, entry) => acc + entry.performanceRating, 0) / 
      (filteredEntries.length || 1);

    const avgCapacity = filteredEntries.reduce((acc, entry) => acc + entry.capacityPercentage, 0) / 
      (filteredEntries.length || 1);

    const activeEmployees = employees.filter(emp => emp.status === 'active').length;

    return {
      avgRating: avgRating.toFixed(1),
      avgCapacity: Math.round(avgCapacity),
      activeEmployees,
      totalEntries: filteredEntries.length,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Performance Overview
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            icon={TrendingUp}
            title="Average Rating"
            value={`${metrics.avgRating}/5`}
          />
          <DashboardCard
            icon={Percent}
            title="Average Capacity"
            value={`${metrics.avgCapacity}%`}
          />
          <DashboardCard
            icon={Users}
            title="Active Employees"
            value={metrics.activeEmployees}
          />
          <DashboardCard
            icon={Target}
            title="Total Entries"
            value={metrics.totalEntries}
          />
        </div>
      </div>
    </div>
  );
};