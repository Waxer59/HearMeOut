import { create } from 'zustand';
import type { AccountDetails, SettingsDetails } from './types/types';
import { devtools } from 'zustand/middleware';

interface Sate {
  account: AccountDetails | null;
  isAuthenticated: boolean;
  settings: SettingsDetails | null;
}

interface Actions {
  setAccount: (a: AccountDetails) => void;
  clearAccount: () => void;
  clearSettings: () => void;
  updateSettings: (s: SettingsDetails) => void;
}

export const useAccountStore = create<Sate & Actions>()(
  devtools((set) => ({
    account: null,
    setAccount: (a) => set({ account: a, isAuthenticated: true }),
    clearAccount: () => set({ account: null, isAuthenticated: false }),
    isAuthenticated: false,
    settings: null,
    clearSettings: () => set({ settings: null }),
    updateSettings: (s) =>
      set((state) => ({
        settings: {
          ...s,
          ...state.settings
        }
      }))
  }))
);
