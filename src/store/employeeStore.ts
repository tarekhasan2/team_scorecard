import { create } from 'zustand';
import { Employee } from '../types';

interface EmployeeStore {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  getEmployeesByManager: (managerId: string) => Employee[];
  getEmployeesByDepartment: (department: string) => Employee[];
}

const initialState: Pick<EmployeeStore, 'employees'> = {
  employees: [],
};

export const useEmployeeStore = create<EmployeeStore>()((set, get) => ({
  ...initialState,
  
  addEmployee: (employee) => 
    set((state) => ({ employees: [...state.employees, employee] })),
  
  updateEmployee: (id, updatedEmployee) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...updatedEmployee } : emp
      ),
    })),
  
  removeEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    })),
  
  getEmployeeById: (id) => get().employees.find((emp) => emp.id === id),
  
  getEmployeesByManager: (managerId) =>
    get().employees.filter((emp) => emp.managerId === managerId),
  
  getEmployeesByDepartment: (department) =>
    get().employees.filter((emp) => emp.department === department),
}));