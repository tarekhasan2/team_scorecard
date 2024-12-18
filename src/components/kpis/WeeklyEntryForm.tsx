import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useKPIStore } from '../../store/kpiStore';
import { useWeeklyEntryStore } from '../../store/weeklyEntryStore';
import { KPI } from '../../types';

const weeklyEntrySchema = z.object({
  week: z.string().min(1, 'Week is required'),
  kpiValues: z.record(z.number().min(0, 'Value must be a positive number')),
  performanceRating: z.number().min(1).max(5),
  ratingJustification: z.string().min(1, 'Please explain your rating'),
  capacityPercentage: z.number().min(0).max(100),
  capacityFactors: z.string().optional(),
  weeklyReflection: z.string().optional(),
  supportNeeded: z.string().optional(),
});

type WeeklyEntryFormData = z.infer<typeof weeklyEntrySchema>;

interface WeeklyEntryFormProps {
  employeeId: string;
  kpis: KPI[];
  onComplete: () => void;
}

export const WeeklyEntryForm: React.FC<WeeklyEntryFormProps> = ({
  employeeId,
  kpis,
  onComplete,
}) => {
  const addWeeklyEntry = useWeeklyEntryStore((state) => state.addEntry);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WeeklyEntryFormData>({
    resolver: zodResolver(weeklyEntrySchema),
    defaultValues: {
      performanceRating: 3,
      capacityPercentage: 100,
    },
  });

  const onSubmit = (data: WeeklyEntryFormData) => {
    const now = new Date().toISOString();
    
    const kpiEntries = Object.entries(data.kpiValues).map(([kpiId, value]) => ({
      kpiId,
      value,
    }));

    const entry = {
      id: crypto.randomUUID(),
      employeeId,
      week: data.week,
      kpiEntries,
      performanceRating: data.performanceRating,
      ratingJustification: data.ratingJustification,
      capacityPercentage: data.capacityPercentage,
      capacityFactors: data.capacityFactors,
      weeklyReflection: data.weeklyReflection,
      supportNeeded: data.supportNeeded,
      createdAt: now,
    };

    addWeeklyEntry(entry);
    reset();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Week Selection */}
      <div>
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

      {/* KPI Values */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">KPI Values</h4>
        {kpis.map((kpi) => (
          <div key={kpi.id}>
            <label htmlFor={`kpiValues.${kpi.id}`} className="block text-sm font-medium text-gray-700">
              {kpi.name} ({kpi.unit})
            </label>
            <div className="mt-1">
              <input
                type="number"
                step="0.01"
                {...register(`kpiValues.${kpi.id}` as any, { valueAsNumber: true })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">{kpi.description}</p>
          </div>
        ))}
      </div>

      {/* Performance Rating */}
      <div>
        <label htmlFor="performanceRating" className="block text-sm font-medium text-gray-700">
          Overall Performance Rating (1-5)
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
        <label htmlFor="ratingJustification" className="block text-sm font-medium text-gray-700">
          Why did you choose this rating?
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
        <label htmlFor="capacityPercentage" className="block text-sm font-medium text-gray-700">
          What is your capacity? (0-100%)
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
        <label htmlFor="capacityFactors" className="block text-sm font-medium text-gray-700">
          Any factors affecting your capacity this week?
        </label>
        <textarea
          {...register('capacityFactors')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="E.g., training, meetings, unexpected issues..."
        />
      </div>

      {/* Weekly Reflection */}
      <div>
        <label htmlFor="weeklyReflection" className="block text-sm font-medium text-gray-700">
          Weekly Reflection
        </label>
        <textarea
          {...register('weeklyReflection')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Tell us something you learned this week, a challenge you faced, or an idea you have to improve our processes. Feel free to shout out a colleague who helped you."
        />
      </div>

      {/* Support Needed */}
      <div>
        <label htmlFor="supportNeeded" className="block text-sm font-medium text-gray-700">
          Support Needed
        </label>
        <textarea
          {...register('supportNeeded')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Is there anything we could do to better support you next week? Be honest and specific."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            reset();
            onComplete();
          }}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Weekly Entry
        </button>
      </div>
    </form>
  );
};