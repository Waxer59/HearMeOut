import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState: State = {
  isSidebarOpen: false,
  isInActiveConversationsTab: true,
  showGroupSettings: false
};

interface State {
  isSidebarOpen: boolean;
  isInActiveConversationsTab: boolean;
  showGroupSettings: boolean;
}

interface Actions {
  setIsSidebarOpen: (value: boolean) => void;
  setIsInActiveConversationsTab: (value: boolean) => void;
  setShowGroupSettings: (value: boolean) => void;
  clearUiState: () => void;
}

export const useUiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setIsSidebarOpen: (value) => set({ isSidebarOpen: value }),
    setIsInActiveConversationsTab: (value) =>
      set({ isInActiveConversationsTab: value }),
    setShowGroupSettings: (value) => set({ showGroupSettings: value }),
    clearUiState: () => set(initialState)
  }))
);
