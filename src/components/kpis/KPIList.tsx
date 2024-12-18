import React, { useState, useEffect } from 'react';
import { useKPIStore } from '../../store/kpiStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useKPICacheStore } from '../../store/kpiCacheStore';
import { Archive, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { EditKPIModal } from './EditKPIModal';
import { KPI } from '../../types';

export const KPIList: React.FC = () => {
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null);
  const kpis = useKPIStore((state) => state.kpis);
  const updateKPI = useKPIStore((state) => state.updateKPI);
  const getEmployeeById = useEmployeeStore((state) => state.getEmployeeById);
  const initializeCache = useKPICacheStore((state) => state.initialize);

  useEffect(() => {
    initializeCache();
  }, [initializeCache]);

  const getAssignedEmployeeNames = (employeeIds: string[]) => {
    return employeeIds
      .map((id) => getEmployeeById(id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const handleStatusChange = (kpiId: string, newStatus: 'active' | 'inactive') => {
    const endDate = newStatus === 'inactive' ? new Date().toISOString() : undefined;
    updateKPI(kpiId, { status: newStatus, endDate });
  };

  const formatTimePeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1);
  };

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Target</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time Period</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Trend</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Start Date</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">End Date</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {kpis.map((kpi) => (
                  <tr key={kpi.id} className={kpi.status === 'inactive' ? 'bg-gray-50' : undefined}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{kpi.name}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{kpi.description}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {kpi.targetValue} {kpi.unit}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatTimePeriod(kpi.timePeriod)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`capitalize ${
                        kpi.preferredTrend === 'higher' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {kpi.preferredTrend}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        kpi.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kpi.status.charAt(0).toUpperCase() + kpi.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(new Date(kpi.startDate), 'MMM d, yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {kpi.endDate ? format(new Date(kpi.endDate), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {getAssignedEmployeeNames(kpi.assignedEmployees)}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {kpi.status === 'active' && (
                        <>
                          <button
                            onClick={() => setEditingKPI(kpi)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(kpi.id, 'inactive')}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingKPI && (
        <EditKPIModal
          kpi={editingKPI}
          onClose={() => setEditingKPI(null)}
        />
      )}
    </div>
  );
};