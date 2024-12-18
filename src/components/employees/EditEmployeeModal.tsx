import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Employee, EmployeeStatus } from '../../types';
import { useEmployeeStore } from '../../store/employeeStore';
import { X } from 'lucide-react';

const DEFAULT_SUPER_RATE = 11.5;

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  department: z.string().min(1, 'Department is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  status: z.enum(['active', 'inactive'] as const),
  salary: z.number().min(0, 'Salary must be a positive number'),
  superannuation: z.object({
    contribution: z.number().min(0, 'Contribution must be a positive number'),
  }),
  bonusPotential: z.number().min(0, 'Bonus potential must be a positive number'),
  managerId: z.string().optional(),
});

type EditEmployeeFormData = z.infer<typeof employeeSchema>;

interface EditEmployeeModalProps {
  employee: Employee;
  onClose: () => void;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ employee, onClose }) => {
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
  const employees = useEmployeeStore((state) => state.employees);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditEmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee.name,
      employeeId: employee.employeeId,
      department: employee.department,
      startDate: employee.startDate,
      endDate: employee.endDate,
      status: employee.status,
      salary: employee.salary,
      superannuation: {
        contribution: employee.superannuation.contribution,
      },
      bonusPotential: employee.bonusPotential,
      managerId: employee.managerId,
    },
  });

  const status = watch('status');
  const salary = watch('salary');
  const superContribution = watch('superannuation.contribution');

  const onSubmit = (data: EditEmployeeFormData) => {
    const superAmount = (data.salary * data.superannuation.contribution) / 100;
    const totalPackage = data.salary + superAmount;

    updateEmployee(employee.id, {
      ...data,
      totalPackage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Edit Employee
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  {...register('employeeId')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.employeeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  {...register('department')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              {status === 'inactive' && (
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                  Base Salary
                </label>
                <input
                  type="number"
                  {...register('salary', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="bonusPotential" className="block text-sm font-medium text-gray-700">
                  Bonus Potential
                </label>
                <input
                  type="number"
                  {...register('bonusPotential', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.bonusPotential && (
                  <p className="mt-1 text-sm text-red-600">{errors.bonusPotential.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="superannuation.contribution" className="block text-sm font-medium text-gray-700">
                  Superannuation Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('superannuation.contribution', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.superannuation?.contribution && (
                  <p className="mt-1 text-sm text-red-600">{errors.superannuation.contribution.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
                  Manager
                </label>
                <select
                  {...register('managerId')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a manager</option>
                  {employees
                    .filter(emp => emp.id !== employee.id) // Prevent self-selection as manager
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};