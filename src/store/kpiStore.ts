import { create } from 'zustand';
import { KPI, KPIEntry } from '../types';

interface KPIStore {
  kpis: KPI[];
  kpiEntries: KPIEntry[];
  addKPI: (kpi: KPI) => void;
  updateKPI: (id: string, kpi: Partial<KPI>) => void;
  archiveKPI: (id: string) => void;
  addKPIEntry: (entry: KPIEntry) => void;
  getKPIById: (id: string) => KPI | undefined;
  getEntriesByKPI: (kpiId: string) => KPIEntry[];
  getEntriesByEmployee: (employeeId: string) => KPIEntry[];
}

const initialState: Pick<KPIStore, 'kpis' | 'kpiEntries'> = {
  kpis: [],
  kpiEntries: [],
};

export const useKPIStore = create<KPIStore>()((set, get) => ({
  ...initialState,
  
  addKPI: (kpi) => 
    set((state) => ({ kpis: [...state.kpis, kpi] })),
  
  updateKPI: (id, updatedKPI) =>
    set((state) => ({
      kpis: state.kpis.map((kpi) =>
        kpi.id === id ? { ...kpi, ...updatedKPI } : kpi
      ),
    })),
  
  archiveKPI: (id) =>
    set((state) => ({
      kpis: state.kpis.map((kpi) =>
        kpi.id === id ? { ...kpi, isArchived: true } : kpi
      ),
    })),
  
  addKPIEntry: (entry) =>
    set((state) => ({ kpiEntries: [...state.kpiEntries, entry] })),
  
  getKPIById: (id) => get().kpis.find((kpi) => kpi.id === id),
  
  getEntriesByKPI: (kpiId) =>
    get().kpiEntries.filter((entry) => entry.kpiId === kpiId),
  
  getEntriesByEmployee: (employeeId) =>
    get().kpiEntries.filter((entry) => entry.employeeId === employeeId),
}));