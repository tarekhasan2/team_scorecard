import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useKPIStore } from '../../store/kpiStore';
import { useKPICacheStore } from '../../store/kpiCacheStore';
import { KPI } from '../../types';

const kpiEntrySchema = z.object({
  value: z.number().min(0, 'Value must be a positive number'),
  notes: z.string().optional(),
  week: z.string().min(1, 'Week is required'),
});

type KPIEntryFormData = z.infer<typeof kpiEntrySchema>;

interface KPIEntryFormProps {
  kpi: KPI;
  employeeId: string;
  onComplete: () => void;
}

export const KPIEntryForm: React.FC<KPIEntryFormProps> = ({ kpi, employeeId, onComplete }) => {
  const addKPIEntry = useKPIStore((state) => state.addKPIEntry);
  const addCachedEntry = useKPICacheStore((state) => state.addEntry);
  const initializeCache = useKPICacheStore((state) => state.initialize);
  const pendingCount = useKPICacheStore((state) => state.getPendingCount());

  useEffect(() => {
    initializeCache();
  }, [initializeCache]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<KPIEntryFormData>({
    resolver: zodResolver(kpiEntrySchema),
  });

  const onSubmit = (data: KPIEntryFormData) => {
    const now = new Date().toISOString();
    const entry = {
      id: crypto.randomUUID(),
      kpiId: kpi.id,
      employeeId,
      value: data.value,
      week: data.week,
      notes: data.notes,
      createdAt: now,
    };

    // Add to both main store and cache
    addKPIEntry(entry);
    addCachedEntry(entry);
    
    reset();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        {pendingCount > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Offline Changes
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You have {pendingCount} unsaved {pendingCount === 1 ? 'change' : 'changes'} that will be synced when you're back online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="week" className="block text-sm font-medium text-gray-700">
              Week
            </label>
            <input
              type="week"
              {...register('week')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.week && (
              <p className="mt-1 text-sm text-red-600">{errors.week.message}</p>
            )}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">
              Value ({kpi.unit})
            </label>
            <input
              type="number"
              step="0.01"
              {...register('value', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
            )}
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
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
          Submit Entry
        </button>
      </div>
    </form>
  );
};