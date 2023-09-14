import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatDetails, GroupDetails } from './types/types';

interface Sate {
  groups: GroupDetails[] | null;
  chats: ChatDetails[] | null;
}

interface Actions {
  setGroups: (groups: GroupDetails[]) => void;
  addGroup: (group: GroupDetails) => void;
  clearGroups: () => void;
  setChats: (chats: ChatDetails[]) => void;
}

export const useChatStore = create<Sate & Actions>()(
  devtools((set) => ({
    groups: null,
    setGroups: (groups) => set({ groups }),
    addGroup: (group) =>
      set((state) => ({
        groups: state.groups ? [...state.groups, group] : [group]
      })),
    clearGroups: () => set({ groups: null }),
    chats: null,
    setChats: (chats) => set({ chats })
  }))
);
