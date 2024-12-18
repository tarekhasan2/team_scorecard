import { KPIEntry } from '../types';

const CACHE_KEY = 'kpi_entries_cache';
const CACHE_VERSION = 1;

interface CacheData {
  version: number;
  entries: KPIEntry[];
  lastSync: string;
}

export const cache = {
  init(): CacheData {
    const defaultCache: CacheData = {
      version: CACHE_VERSION,
      entries: [],
      lastSync: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (!stored) return defaultCache;

      const parsed = JSON.parse(stored) as CacheData;
      if (parsed.version !== CACHE_VERSION) return defaultCache;

      return parsed;
    } catch {
      return defaultCache;
    }
  },

  save(data: CacheData): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to cache:', error);
    }
  },

  clear(): void {
    localStorage.removeItem(CACHE_KEY);
  },
};