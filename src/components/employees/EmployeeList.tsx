import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { EditEmployeeModal } from './EditEmployeeModal';
import { Employee } from '../../types';

export const EmployeeList: React.FC = () => {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const employees = useEmployeeStore((state) => state.employees);
  const removeEmployee = useEmployeeStore((state) => state.removeEmployee);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  const getManagerName = (managerId?: string) => {
    if (!managerId) return '-';
    const manager = employees.find(emp => emp.id === managerId);
    return manager ? manager.name : '-';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      removeEmployee(id);
    }
  };

  return (
    <>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Employee ID</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Manager</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Start Date</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">End Date</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Package</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{employee.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.employeeId}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.department}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getManagerName(employee.managerId)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(employee.startDate), 'MMM d, yyyy')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {employee.endDate ? format(new Date(employee.endDate), 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatCurrency(employee.totalPackage)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => setEditingEmployee(employee)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
        />
      )}
    </>
  );
};