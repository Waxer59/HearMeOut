import { create } from 'zustand';
import type { AccountDetails } from '../types/types';

interface AccountSate {
  account: AccountDetails | null;
  setAccount: (a: AccountDetails) => void;
  clearAccount: () => void;
  isAuthenticated: boolean;
  settings: object;
  clearSettings: () => void;
  updateSettings: (s: object) => void;
}

export const useAccountStore = create<AccountSate>((set) => ({
  account: null,
  setAccount: (a) => set({ account: a, isAuthenticated: true }),
  clearAccount: () => set({ account: null, isAuthenticated: false }),

  isAuthenticated: false,

  settings: {},
  clearSettings: () => set({ settings: {} }),
  updateSettings: (s) =>
    set((state) => ({
      settings: {
        s,
        ...state.settings
      }
    }))
}));
