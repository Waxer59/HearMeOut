// import { create } from 'zustand';

// interface ChatState {
//   groups: [{}];
//   setGroups: (groups: object) => void;
//   clearGroups: () => void;
//   chats: [{}];
//   closeChat: (chatId: string) => void;
//   openChat: (chatId: string) => void;
// }

// export const useChatStore = create<ChatState>((set) => ({
//   groups: [{}],
//   setGroups: (groups) => set({ groups }),
//   clearGroups: () => set({ groups: [{}] }),
//   chats: [{}],
//   closeChat: (chatId) =>
//     set((state) => state.chats.filter((chat) => chat.id !== chatId)),
//   openChat: (chatId) =>
//     set((state) => state.chats.filter((chat) => chat.id === chatId))
// }));
