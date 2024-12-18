import { Employee, EmployeeStatus } from '../types';

export const exportEmployeesToCSV = (employees: Employee[]): string => {
  // Create CSV header
  const headers = [
    'Name',
    'Employee ID',
    'Department',
    'Status',
    'Start Date',
    'End Date',
    'Salary',
    'Superannuation Rate',
    'Bonus Potential',
    'Manager Employee ID',
  ];

  // Transform employees to CSV rows
  const rows = employees.map(employee => {
    // Find manager's employee ID
    const manager = employees.find(emp => emp.id === employee.managerId);
    const managerEmployeeId = manager ? manager.employeeId : '';

    return [
      `"${employee.name.replace(/"/g, '""')}"`,
      employee.employeeId,
      `"${employee.department.replace(/"/g, '""')}"`,
      employee.status,
      employee.startDate,
      employee.endDate || '',
      employee.salary.toString(),
      employee.superannuation.contribution.toString(),
      employee.bonusPotential.toString(),
      managerEmployeeId,
    ];
  });

  // Combine headers and rows
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

export const parseEmployeesCSV = (csvContent: string, existingEmployees: Employee[] = []): Employee[] => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(value => 
      value.startsWith('"') && value.endsWith('"') 
        ? value.slice(1, -1).replace(/""/g, '"') 
        : value
    );

    const [name, employeeId, department, status, startDate, endDate, salary, superRate, bonusPotential, managerEmployeeId] = values;

    // Find manager's UUID by their employee ID
    const manager = existingEmployees.find(emp => emp.employeeId === managerEmployeeId);
    const managerId = manager ? manager.id : undefined;

    return {
      id: crypto.randomUUID(),
      name,
      employeeId,
      department,
      status: status as EmployeeStatus,
      startDate,
      endDate: endDate || undefined,
      salary: parseFloat(salary),
      superannuation: {
        contribution: parseFloat(superRate),
      },
      bonusPotential: parseFloat(bonusPotential),
      managerId,
      totalPackage: parseFloat(salary) * (1 + parseFloat(superRate) / 100),
      kpis: [],
    };
  });
};