import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KPI, KPIStatus, TimePeriod } from '../../types';
import { useKPIStore } from '../../store/kpiStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { X } from 'lucide-react';

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

type EditKPIFormData = z.infer<typeof kpiSchema>;

interface EditKPIModalProps {
  kpi: KPI;
  onClose: () => void;
}

export const EditKPIModal: React.FC<EditKPIModalProps> = ({ kpi, onClose }) => {
  const updateKPI = useKPIStore((state) => state.updateKPI);
  const employees = useEmployeeStore((state) => state.employees);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditKPIFormData>({
    resolver: zodResolver(kpiSchema),
    defaultValues: {
      name: kpi.name,
      description: kpi.description,
      targetValue: kpi.targetValue,
      unit: kpi.unit,
      preferredTrend: kpi.preferredTrend,
      timePeriod: kpi.timePeriod,
      status: kpi.status,
      startDate: kpi.startDate,
      endDate: kpi.endDate,
      assignedEmployees: kpi.assignedEmployees,
    },
  });

  const status = watch('status');

  const onSubmit = (data: EditKPIFormData) => {
    updateKPI(kpi.id, {
      ...data,
      updatedAt: new Date().toISOString(),
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
              Edit KPI
            </h3>

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

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
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

              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <select
                  {...register('unit')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="number">Number</option>
                  <option value="percentage">Percentage</option>
                  <option value="currency">Currency</option>
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="preferredTrend" className="block text-sm font-medium text-gray-700">
                  Preferred Trend
                </label>
                <select
                  {...register('preferredTrend')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="higher">Higher is Better</option>
                  <option value="lower">Lower is Better</option>
                </select>
                {errors.preferredTrend && (
                  <p className="mt-1 text-sm text-red-600">{errors.preferredTrend.message}</p>
                )}
              </div>

              <div>
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
            </div>

            <div>
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