import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEmployeeStore } from '../../store/employeeStore';
import { EmployeeStatus } from '../../types';

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

type EmployeeFormData = z.infer<typeof employeeSchema>;

export const EmployeeForm: React.FC = () => {
  const addEmployee = useEmployeeStore((state) => state.addEmployee);
  const employees = useEmployeeStore((state) => state.employees);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      status: 'active' as EmployeeStatus,
      superannuation: {
        contribution: DEFAULT_SUPER_RATE,
      },
      bonusPotential: 0,
    },
  });

  const status = watch('status');
  const salary = watch('salary');
  const superContribution = watch('superannuation.contribution');

  // Calculate total package whenever salary or super changes
  React.useEffect(() => {
    if (salary && superContribution) {
      const superAmount = (salary * superContribution) / 100;
      const totalPackage = salary + superAmount;
      // Note: totalPackage is calculated but not shown in the form
      // It will be stored in the employee object when submitted
    }
  }, [salary, superContribution]);

  const onSubmit = (data: EmployeeFormData) => {
    const superAmount = (data.salary * data.superannuation.contribution) / 100;
    const totalPackage = data.salary + superAmount;

    addEmployee({
      ...data,
      id: crypto.randomUUID(),
      totalPackage,
      kpis: [],
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
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
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Employee
        </button>
      </div>
    </form>
  );
};