import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { useKPIStore } from '../../store/kpiStore';
import { WeeklyEntryForm } from './WeeklyEntryForm';
import { KPIEntriesTab } from './KPIEntriesTab';
import { ClipboardList, History } from 'lucide-react';

export const KPIEntryPage: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [activeTab, setActiveTab] = useState<'entry' | 'history'>('entry');
  const employees = useEmployeeStore((state) => state.employees);
  const kpis = useKPIStore((state) => state.kpis);

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  
  const getEmployeeKPIs = (employeeId: string) => {
    return kpis.filter(
      kpi => 
        kpi.status === 'active' && 
        kpi.assignedEmployees.includes(employeeId)
    );
  };

  const employeeKPIs = selectedEmployee ? getEmployeeKPIs(selectedEmployee) : [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            KPI Management
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('entry')}
            className={`${
              activeTab === 'entry'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ClipboardList className="h-5 w-5 mr-2" />
            New Entry
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <History className="h-5 w-5 mr-2" />
            Entry History
          </button>
        </nav>
      </div>

      <div className="mt-8 space-y-8">
        {activeTab === 'entry' ? (
          <>
            {/* Employee Selection */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Select Employee
                </h3>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select an employee</option>
                  {activeEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Weekly Entry Form */}
            {selectedEmployee && employeeKPIs.length > 0 && (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <WeeklyEntryForm
                    employeeId={selectedEmployee}
                    kpis={employeeKPIs}
                    onComplete={() => setSelectedEmployee('')}
                  />
                </div>
              </div>
            )}

            {/* No KPIs Message */}
            {selectedEmployee && employeeKPIs.length === 0 && (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No active KPIs</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This employee has no active KPIs assigned.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <KPIEntriesTab />
        )}
      </div>
    </div>
  );
};