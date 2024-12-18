import React from 'react';
import { useWeeklyEntryStore } from '../../store/weeklyEntryStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TeamPerformanceChartProps {
  filters: {
    department: string;
    startDate: string;
    endDate: string;
    manager: string;
  };
}

export const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({ filters }) => {
  const entries = useWeeklyEntryStore((state) => state.entries);
  const employees = useEmployeeStore((state) => state.employees);

  const prepareChartData = () => {
    const employeePerformance = employees
      .filter(emp => {
        if (filters.department && emp.department !== filters.department) return false;
        if (filters.manager && emp.managerId !== filters.manager) return false;
        return true;
      })
      .map(employee => {
        const employeeEntries = entries.filter(entry => entry.employeeId === employee.id);
        const avgRating = employeeEntries.reduce((acc, entry) => acc + entry.performanceRating, 0) / 
          (employeeEntries.length || 1);
        const avgCapacity = employeeEntries.reduce((acc, entry) => acc + entry.capacityPercentage, 0) / 
          (employeeEntries.length || 1);

        return {
          name: employee.name,
          rating: Number(avgRating.toFixed(1)),
          capacity: Math.round(avgCapacity),
        };
      });

    return employeePerformance;
  };

  const data = prepareChartData();

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Team Performance Overview
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="rating" name="Avg Rating" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="capacity" name="Avg Capacity %" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};