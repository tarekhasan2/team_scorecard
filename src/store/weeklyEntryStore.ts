import { create } from 'zustand';
import { WeeklyEntry } from '../types';

interface WeeklyEntryStore {
  entries: WeeklyEntry[];
  addEntry: (entry: WeeklyEntry) => void;
  updateEntry: (id: string, entry: WeeklyEntry) => void;
  getEntriesByEmployee: (employeeId: string) => WeeklyEntry[];
  getEntryByWeek: (employeeId: string, week: string) => WeeklyEntry | undefined;
}

export const useWeeklyEntryStore = create<WeeklyEntryStore>()((set, get) => ({
  entries: [],
  
  addEntry: (entry) => 
    set((state) => ({ entries: [...state.entries, entry] })),
  
  updateEntry: (id, updatedEntry) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? updatedEntry : entry
      ),
    })),
  
  getEntriesByEmployee: (employeeId) =>
    get().entries.filter((entry) => entry.employeeId === employeeId),
  
  getEntryByWeek: (employeeId, week) =>
    get().entries.find(
      (entry) => entry.employeeId === employeeId && entry.week === week
    ),
}));