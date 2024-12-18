import React, { useState } from 'react';
import { PerformanceDashboard } from './PerformanceDashboard';
import { TeamPerformanceChart } from './TeamPerformanceChart';
import { KPITrendsChart } from './KPITrendsChart';
import { DepartmentOverview } from './DepartmentOverview';
import { Filter } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    department: '',
    startDate: '',
    endDate: '',
    manager: '',
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Performance Reports
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                id="department"
                value={filters.department}
                onChange={(e) => setFilters(f => ({ ...f, department: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="hr">HR</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={filters.startDate}
                onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={filters.endDate}
                onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                Manager
              </label>
              <select
                id="manager"
                value={filters.manager}
                onChange={(e) => setFilters(f => ({ ...f, manager: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Managers</option>
                {/* Managers will be populated dynamically */}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Performance Overview */}
        <PerformanceDashboard filters={filters} />

        {/* Department Overview */}
        <DepartmentOverview filters={filters} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TeamPerformanceChart filters={filters} />
          <KPITrendsChart filters={filters} />
        </div>
      </div>
    </div>
  );
};