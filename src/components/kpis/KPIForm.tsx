import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useKPIStore } from '../../store/kpiStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { KPIStatus, TimePeriod } from '../../types';

const kpiSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  targetValue: z.number().min(0, 'Target value must be a positive number'),
  unit: z.enum(['number', 'percentage', 'currency'], {
    required_error: 'Please select a unit',
  }),
  preferredTrend: z.enum(['higher', 'lower'], {
    required_error: 'Please select a preferred trend',
  }),
  timePeriod: z.enum(['weekly', 'monthly', 'quarterly', 'yearly'] as const, {
    required_error: 'Please select a time period',
  }),
  status: z.enum(['active', 'inactive'] as const),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  assignedEmployees: z.array(z.string()).min(1, 'At least one employee must be assigned'),
});

type KPIFormData = z.infer<typeof kpiSchema>;

interface KPIFormProps {
  onComplete: () => void;
}

export const KPIForm: React.FC<KPIFormProps> = ({ onComplete }) => {
  const addKPI = useKPIStore((state) => state.addKPI);
  const employees = useEmployeeStore((state) => state.employees);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<KPIFormData>({
    resolver: zodResolver(kpiSchema),
    defaultValues: {
      status: 'active' as KPIStatus,
      timePeriod: 'monthly' as TimePeriod,
      assignedEmployees: [],
    },
  });

  const status = watch('status');

  const onSubmit = (data: KPIFormData) => {
    const now = new Date().toISOString();
    addKPI({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
    reset();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
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

          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700">
              Target Value
            </label>
            <input
              type="number"
              step="0.01"
              {...register('targetValue', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.targetValue && (
              <p className="mt-1 text-sm text-red-600">{errors.targetValue.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              {...register('unit')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a unit</option>
              <option value="number">Number</option>
              <option value="percentage">Percentage</option>
              <option value="currency">Currency</option>
            </select>
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700">
              Time Period
            </label>
            <select
              {...register('timePeriod')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            {errors.timePeriod && (
              <p className="mt-1 text-sm text-red-600">{errors.timePeriod.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="preferredTrend" className="block text-sm font-medium text-gray-700">
              Preferred Trend
            </label>
            <select
              {...register('preferredTrend')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a trend</option>
              <option value="higher">Higher is Better</option>
              <option value="lower">Lower is Better</option>
            </select>
            {errors.preferredTrend && (
              <p className="mt-1 text-sm text-red-600">{errors.preferredTrend.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
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

          <div className="sm:col-span-2">
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
            <div className="sm:col-span-2">
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

          <div className="sm:col-span-6">
            <label htmlFor="assignedEmployees" className="block text-sm font-medium text-gray-700">
              Assigned Employees
            </label>
            <select
              multiple
              {...register('assignedEmployees')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              size={4}
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.department})
                </option>
              ))}
            </select>
            {errors.assignedEmployees && (
              <p className="mt-1 text-sm text-red-600">{errors.assignedEmployees.message}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Hold Ctrl/Cmd to select multiple employees
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            reset();
            onComplete();
          }}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create KPI
        </button>
      </div>
    </form>
  );
};