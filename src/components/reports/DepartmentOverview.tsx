import React from 'react';
import { useWeeklyEntryStore } from '../../store/weeklyEntryStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useKPIStore } from '../../store/kpiStore';

interface DepartmentOverviewProps {
  filters: {
    department: string;
    startDate: string;
    endDate: string;
    manager: string;
  };
}

export const DepartmentOverview: React.FC<DepartmentOverviewProps> = ({ filters }) => {
  const entries = useWeeklyEntryStore((state) => state.entries);
  const employees = useEmployeeStore((state) => state.employees);
  const kpis = useKPIStore((state) => state.kpis);

  const calculateDepartmentMetrics = () => {
    const departments = [...new Set(employees.map(emp => emp.department))];
    
    return departments.map(department => {
      const departmentEmployees = employees.filter(emp => emp.department === department);
      const departmentEntries = entries.filter(entry => 
        departmentEmployees.some(emp => emp.id === entry.employeeId)
      );

      const avgRating = departmentEntries.reduce((acc, entry) => acc + entry.performanceRating, 0) / 
        (departmentEntries.length || 1);

      const avgCapacity = departmentEntries.reduce((acc, entry) => acc + entry.capacityPercentage, 0) / 
        (departmentEntries.length || 1);

      return {
        department,
        employeeCount: departmentEmployees.length,
        avgRating: avgRating.toFixed(1),
        avgCapacity: Math.round(avgCapacity),
        entriesCount: departmentEntries.length,
      };
    });
  };

  const departmentMetrics = calculateDepartmentMetrics();

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Department Overview
        </h3>
        <div className="mt-4">
          <div className="flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Department
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Employees
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Avg Rating
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Avg Capacity
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Total Entries
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {departmentMetrics.map((metric) => (
                      <tr key={metric.department}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {metric.department}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {metric.employeeCount}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            Number(metric.avgRating) >= 4 ? 'bg-green-100 text-green-800' :
                            Number(metric.avgRating) >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {metric.avgRating}/5
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {metric.avgCapacity}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {metric.entriesCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};