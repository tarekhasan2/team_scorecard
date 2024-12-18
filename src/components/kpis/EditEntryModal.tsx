import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WeeklyEntry } from '../../types';
import { useWeeklyEntryStore } from '../../store/weeklyEntryStore';
import { X } from 'lucide-react';

const editEntrySchema = z.object({
  performanceRating: z.number().min(1).max(5),
  ratingJustification: z.string().min(1, 'Please explain your rating'),
  capacityPercentage: z.number().min(0).max(100),
  capacityFactors: z.string().optional(),
  weeklyReflection: z.string().optional(),
  supportNeeded: z.string().optional(),
  kpiEntries: z.array(z.object({
    kpiId: z.string(),
    value: z.number().min(0, 'Value must be a positive number'),
  })),
});

type EditEntryFormData = z.infer<typeof editEntrySchema>;

interface EditEntryModalProps {
  entry: WeeklyEntry;
  onClose: () => void;
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({ entry, onClose }) => {
  const updateEntry = useWeeklyEntryStore((state) => state.updateEntry);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditEntryFormData>({
    resolver: zodResolver(editEntrySchema),
    defaultValues: {
      performanceRating: entry.performanceRating,
      ratingJustification: entry.ratingJustification,
      capacityPercentage: entry.capacityPercentage,
      capacityFactors: entry.capacityFactors,
      weeklyReflection: entry.weeklyReflection,
      supportNeeded: entry.supportNeeded,
      kpiEntries: entry.kpiEntries,
    },
  });

  const onSubmit = (data: EditEntryFormData) => {
    updateEntry(entry.id, {
      ...entry,
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
              Edit Entry for Week {entry.week}
            </h3>

            {/* KPI Values */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">KPI Values</h4>
              {entry.kpiEntries.map((kpi, index) => (
                <div key={kpi.kpiId}>
                  <input type="hidden" {...register(`kpiEntries.${index}.kpiId` as const)} value={kpi.kpiId} />
                  <label className="block text-sm font-medium text-gray-700">
                    Value
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`kpiEntries.${index}.value` as const, { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Performance Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Performance Rating (1-5)
              </label>
              <select
                {...register('performanceRating', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value={1}>1 - Needs significant improvement</option>
                <option value={2}>2 - Below expectations</option>
                <option value={3}>3 - Meets expectations</option>
                <option value={4}>4 - Exceeds expectations</option>
                <option value={5}>5 - Outstanding performance</option>
              </select>
            </div>

            {/* Rating Justification */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating Justification
              </label>
              <textarea
                {...register('ratingJustification')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.ratingJustification && (
                <p className="mt-1 text-sm text-red-600">{errors.ratingJustification.message}</p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                {...register('capacityPercentage', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Capacity Factors */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity Factors
              </label>
              <textarea
                {...register('capacityFactors')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Weekly Reflection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weekly Reflection
              </label>
              <textarea
                {...register('weeklyReflection')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Support Needed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Support Needed
              </label>
              <textarea
                {...register('supportNeeded')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
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