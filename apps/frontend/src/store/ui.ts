import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState: State = {
  isSidebarOpen: false,
  isInActiveConversationsTab: true,
  showGroupSettings: false,
  chatQueryFilter: null
};

interface State {
  isSidebarOpen: boolean;
  isInActiveConversationsTab: boolean;
  showGroupSettings: boolean;
  chatQueryFilter: string | null;
}

interface Actions {
  setIsSidebarOpen: (value: boolean) => void;
  setIsInActiveConversationsTab: (value: boolean) => void;
  setShowGroupSettings: (value: boolean) => void;
  clearUiState: () => void;
  setChatQueryFilter: (query: string | null) => void;
}

export const useUiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setIsSidebarOpen: (value) => set({ isSidebarOpen: value }),
    setIsInActiveConversationsTab: (value) =>
      set({ isInActiveConversationsTab: value }),
    setShowGroupSettings: (value) => set({ showGroupSettings: value }),
    clearUiState: () => set(initialState),
    setChatQueryFilter: (query) => set({ chatQueryFilter: query })
  }))
);
