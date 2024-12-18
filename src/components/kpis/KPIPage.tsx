import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { KPIList } from './KPIList';
import { KPIForm } from './KPIForm';
import { ImportExportButtons } from './ImportExportButtons';

export const KPIPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Key Performance Indicators
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-4">
          <ImportExportButtons />
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Create KPI
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-8">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">KPI Information</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Define a new key performance indicator for your team members.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <KPIForm onComplete={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}

      <KPIList />
    </div>
  );
};