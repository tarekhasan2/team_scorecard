import { WeeklyEntry, KPI } from '../types';
import { parse, format } from 'date-fns';

export const exportToCSV = (entries: WeeklyEntry[], kpis: KPI[]): string => {
  // Create CSV header
  const headers = [
    'Week',
    'Employee ID',
    'Performance Rating',
    'Rating Justification',
    'Capacity %',
    'Capacity Factors',
    'Weekly Reflection',
    'Support Needed',
    ...kpis.map(kpi => `KPI: ${kpi.name}`),
  ];

  // Transform entries to CSV rows
  const rows = entries.map(entry => {
    const kpiValues = kpis.map(kpi => {
      const kpiEntry = entry.kpiEntries.find(e => e.kpiId === kpi.id);
      return kpiEntry ? kpiEntry.value.toString() : '';
    });

    return [
      entry.week,
      entry.employeeId,
      entry.performanceRating.toString(),
      `"${entry.ratingJustification.replace(/"/g, '""')}"`,
      entry.capacityPercentage.toString(),
      `"${(entry.capacityFactors || '').replace(/"/g, '""')}"`,
      `"${(entry.weeklyReflection || '').replace(/"/g, '""')}"`,
      `"${(entry.supportNeeded || '').replace(/"/g, '""')}"`,
      ...kpiValues,
    ];
  });

  // Combine headers and rows
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

export const parseCSV = (csvContent: string, kpis: KPI[]): WeeklyEntry[] => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  // Map KPI columns to their IDs
  const kpiIndices = headers.reduce((acc, header, index) => {
    if (header.startsWith('KPI: ')) {
      const kpiName = header.substring(5);
      const kpi = kpis.find(k => k.name === kpiName);
      if (kpi) {
        acc[index] = kpi.id;
      }
    }
    return acc;
  }, {} as Record<number, string>);

  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(value => 
      value.startsWith('"') && value.endsWith('"') 
        ? value.slice(1, -1).replace(/""/g, '"') 
        : value
    );

    const kpiEntries = Object.entries(kpiIndices).map(([index, kpiId]) => ({
      kpiId,
      value: parseFloat(values[parseInt(index)]),
    }));

    return {
      id: crypto.randomUUID(),
      week: values[0],
      employeeId: values[1],
      performanceRating: parseInt(values[2]),
      ratingJustification: values[3],
      capacityPercentage: parseInt(values[4]),
      capacityFactors: values[5] || undefined,
      weeklyReflection: values[6] || undefined,
      supportNeeded: values[7] || undefined,
      kpiEntries,
      createdAt: new Date().toISOString(),
    };
  });
};