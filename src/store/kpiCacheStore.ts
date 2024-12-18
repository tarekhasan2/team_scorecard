import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { KPIEntry } from '../types';

interface KPICacheStore {
  entries: KPIEntry[];
  lastSync: string;
  pendingSync: KPIEntry[];
  initialized: boolean;
  
  // Actions
  initialize: () => void;
  addEntry: (entry: KPIEntry) => void;
  syncEntries: () => Promise<void>;
  getPendingCount: () => number;
  getEntriesByKPI: (kpiId: string) => KPIEntry[];
  getEntriesByEmployee: (employeeId: string) => KPIEntry[];
  getEntriesByWeek: (week: string) => KPIEntry[];
}

export const useKPICacheStore = create<KPICacheStore>()(
  persist(
    (set, get) => ({
      entries: [],
      lastSync: new Date().toISOString(),
      pendingSync: [],
      initialized: false,

      initialize: () => {
        if (get().initialized) return;
        set({ initialized: true });
      },

      addEntry: (entry: KPIEntry) => {
        set((state) => {
          // Check for duplicates
          const isDuplicate = state.entries.some(e => e.id === entry.id);
          if (isDuplicate) return state;

          const newEntries = [...state.entries, entry];
          const newPendingSync = [...state.pendingSync, entry];
          
          return {
            entries: newEntries,
            pendingSync: newPendingSync,
          };
        });
      },

      syncEntries: async () => {
        const state = get();
        if (state.pendingSync.length === 0) return;

        try {
          // Here you would typically sync with your backend
          // For now, we'll just simulate a successful sync
          const now = new Date().toISOString();
          
          set({
            pendingSync: [],
            lastSync: now,
          });
        } catch (error) {
          console.error('Failed to sync entries:', error);
          // Optionally, you could retry the sync or mark entries as failed
        }
      },

      getPendingCount: () => get().pendingSync.length,

      getEntriesByKPI: (kpiId: string) =>
        get().entries.filter((entry) => entry.kpiId === kpiId),

      getEntriesByEmployee: (employeeId: string) =>
        get().entries.filter((entry) => entry.employeeId === employeeId),

      getEntriesByWeek: (week: string) =>
        get().entries.filter((entry) => entry.week === week),
    }),
    {
      name: 'kpi-entries-cache',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        entries: state.entries,
        lastSync: state.lastSync,
        pendingSync: state.pendingSync,
      }),
    }
  )
);