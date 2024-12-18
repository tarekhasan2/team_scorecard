import { create } from 'zustand';
import { Role } from '../types/roles';

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    roles?: Role[];
  };
}

interface AuthStore {
  user: User | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  initialized: false,
  setUser: (user) => set({ user }),
  setInitialized: (initialized) => set({ initialized }),
}));