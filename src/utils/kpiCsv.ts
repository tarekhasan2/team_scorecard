import { KPI, KPIStatus, TimePeriod } from '../types';
import { useEmployeeStore } from '../store/employeeStore';

export const exportKPIsToCSV = (kpis: KPI[]): string => {
  const employees = useEmployeeStore.getState().employees;

  // Create CSV header
  const headers = [
    'Name',
    'Description',
    'Target Value',
    'Unit',
    'Preferred Trend',
    'Time Period',
    'Status',
    'Start Date',
    'End Date',
    'Assigned Employee IDs',
  ];

  // Transform KPIs to CSV rows
  const rows = kpis.map(kpi => {
    // Convert internal IDs to employee IDs
    const assignedEmployeeIds = kpi.assignedEmployees
      .map(id => employees.find(emp => emp.id === id)?.employeeId || '')
      .filter(Boolean)
      .join(';');

    return [
      `"${kpi.name.replace(/"/g, '""')}"`,
      `"${kpi.description.replace(/"/g, '""')}"`,
      kpi.targetValue.toString(),
      kpi.unit,
      kpi.preferredTrend,
      kpi.timePeriod,
      kpi.status,
      kpi.startDate,
      kpi.endDate || '',
      `"${assignedEmployeeIds}"`,
    ];
  });

  // Combine headers and rows
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

export const parseKPIsCSV = (csvContent: string): KPI[] => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const employees = useEmployeeStore.getState().employees;

  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(value => 
      value.startsWith('"') && value.endsWith('"') 
        ? value.slice(1, -1).replace(/""/g, '"') 
        : value
    );

    const [
      name,
      description,
      targetValue,
      unit,
      preferredTrend,
      timePeriod,
      status,
      startDate,
      endDate,
      assignedEmployeeIds,
    ] = values;

    // Convert employee IDs to internal IDs
    const assignedEmployees = assignedEmployeeIds
      .split(';')
      .filter(Boolean)
      .map(employeeId => employees.find(emp => emp.employeeId === employeeId)?.id || '')
      .filter(Boolean);

    const now = new Date().toISOString();

    return {
      id: crypto.randomUUID(),
      name,
      description,
      targetValue: parseFloat(targetValue),
      unit: unit as 'number' | 'percentage' | 'currency',
      preferredTrend: preferredTrend as 'higher' | 'lower',
      timePeriod: timePeriod as TimePeriod,
      status: status as KPIStatus,
      startDate,
      endDate: endDate || undefined,
      assignedEmployees,
      createdAt: now,
      updatedAt: now,
    };
  });
};