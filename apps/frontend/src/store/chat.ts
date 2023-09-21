import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatDetails, GroupDetails } from './types/types';

interface Sate {
  groups: GroupDetails[];
  chats: ChatDetails[];
  active: any | null;
}

interface Actions {
  setGroups: (groups: GroupDetails[]) => void;
  addGroup: (group: GroupDetails) => void;
  clearGroups: () => void;
  setChats: (chats: ChatDetails[]) => void;
  addChats: (chat: ChatDetails) => void;
  clearChats: () => void;
  setActive: (active: any) => void;
  clearActive: () => void;
}

export const useChatStore = create<Sate & Actions>()(
  devtools((set) => ({
    groups: [],
    setGroups: (groups) => set({ groups }),
    addGroup: (group) =>
      set((state) => ({
        groups: state.groups ? [...state.groups, group] : [group]
      })),
    clearGroups: () => set({ groups: [] }),
    chats: [],
    setChats: (chats) => set({ chats }),
    addChats: (chat) =>
      set((state) => ({
        chats: state.chats ? [...state.chats, chat] : [chat]
      })),
    clearChats: () => set({ chats: [] }),
    active: null,
    setActive: (active) => set({ active }),
    clearActive: () => set({ active: null })
  }))
);
