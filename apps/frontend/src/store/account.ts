import { create } from 'zustand';

interface AccountSate {
  account: object | null;
  setAccount: (a: object) => void;
  clearAccount: () => void;
  isAuthenticated: boolean;
  settings: object;
  clearSettings: () => void;
  updateSettings: (s: object) => void;
}

export const useAccountStore = create<AccountSate>((set) => ({
  account: {},
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
