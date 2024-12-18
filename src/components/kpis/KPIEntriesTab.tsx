import React, { useState } from 'react';
import { useWeeklyEntryStore } from '../../store/weeklyEntryStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useKPIStore } from '../../store/kpiStore';
import { format } from 'date-fns';
import { Search, Filter, Edit2 } from 'lucide-react';
import { EditEntryModal } from './EditEntryModal';
import { ImportExportButtons } from './ImportExportButtons';
import { WeeklyEntry } from '../../types';

interface Filters {
  employeeId: string;
  startWeek: string;
  endWeek: string;
  minRating: string;
  maxRating: string;
}

export const KPIEntriesTab: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    employeeId: '',
    startWeek: '',
    endWeek: '',
    minRating: '',
    maxRating: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState<WeeklyEntry | null>(null);

  const entries = useWeeklyEntryStore((state) => state.entries);
  const employees = useEmployeeStore((state) => state.employees);
  const kpis = useKPIStore((state) => state.kpis);

  const getEmployeeName = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId)?.name || 'Unknown Employee';
  };

  const getKPIName = (kpiId: string) => {
    return kpis.find(kpi => kpi.id === kpiId)?.name || 'Unknown KPI';
  };

  const formatWeekDate = (weekString: string) => {
    try {
      const [year, week] = weekString.split('-W');
      const date = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return weekString;
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (filters.employeeId && entry.employeeId !== filters.employeeId) return false;
    
    if (filters.startWeek && entry.week < filters.startWeek) return false;
    if (filters.endWeek && entry.week > filters.endWeek) return false;
    
    if (filters.minRating && entry.performanceRating < parseInt(filters.minRating)) return false;
    if (filters.maxRating && entry.performanceRating > parseInt(filters.maxRating)) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const employeeName = getEmployeeName(entry.employeeId).toLowerCase();
      const reflection = (entry.weeklyReflection || '').toLowerCase();
      const support = (entry.supportNeeded || '').toLowerCase();
      
      return employeeName.includes(searchLower) ||
             reflection.includes(searchLower) ||
             support.includes(searchLower);
    }

    return true;
  }).sort((a, b) => b.week.localeCompare(a.week));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search entries..."
            />
          </div>
        </div>
        <ImportExportButtons />
      </div>

      {/* Filters */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                Employee
              </label>
              <select
                id="employeeId"
                value={filters.employeeId}
                onChange={(e) => setFilters(f => ({ ...f, employeeId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Employees</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="startWeek" className="block text-sm font-medium text-gray-700">
                Start Week
              </label>
              <input
                type="week"
                id="startWeek"
                value={filters.startWeek}
                onChange={(e) => setFilters(f => ({ ...f, startWeek: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="endWeek" className="block text-sm font-medium text-gray-700">
                End Week
              </label>
              <input
                type="week"
                id="endWeek"
                value={filters.endWeek}
                onChange={(e) => setFilters(f => ({ ...f, endWeek: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="minRating" className="block text-sm font-medium text-gray-700">
                Min Rating
              </label>
              <select
                id="minRating"
                value={filters.minRating}
                onChange={(e) => setFilters(f => ({ ...f, minRating: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="maxRating" className="block text-sm font-medium text-gray-700">
                Max Rating
              </label>
              <select
                id="maxRating"
                value={filters.maxRating}
                onChange={(e) => setFilters(f => ({ ...f, maxRating: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Entries Table */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Week</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Employee</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Capacity</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">KPIs</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reflection</th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {formatWeekDate(entry.week)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {getEmployeeName(entry.employeeId)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            entry.performanceRating >= 4 ? 'bg-green-100 text-green-800' :
                            entry.performanceRating >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {entry.performanceRating}/5
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {entry.capacityPercentage}%
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <ul className="list-disc list-inside">
                            {entry.kpiEntries.map((kpiEntry) => (
                              <li key={kpiEntry.kpiId}>
                                {getKPIName(kpiEntry.kpiId)}: {kpiEntry.value}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {entry.weeklyReflection || '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => setEditingEntry(entry)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
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

      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
};