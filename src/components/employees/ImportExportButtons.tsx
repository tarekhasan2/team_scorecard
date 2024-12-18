import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useEmployeeStore } from '../../store/employeeStore';
import { exportEmployeesToCSV, parseEmployeesCSV } from '../../utils/employeeCsv';

export const ImportExportButtons: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const employees = useEmployeeStore((state) => state.employees);
  const addEmployee = useEmployeeStore((state) => state.addEmployee);

  const handleExport = () => {
    const csv = exportEmployeesToCSV(employees);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-members-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedEmployees = parseEmployeesCSV(content, employees);
        importedEmployees.forEach(employee => addEmployee(employee));
        alert('Import successful!');
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import CSV. Please check the file format.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleExport}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Download className="-ml-1 mr-2 h-5 w-5" />
        Export CSV
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleImport}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Upload className="-ml-1 mr-2 h-5 w-5" />
        Import CSV
      </button>
    </div>
  );
};