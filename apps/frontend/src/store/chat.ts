import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AccountDetails,
  ConversationDetails,
  MessageDetails,
  UserTyping
} from './types/types';
import type { Socket } from 'socket.io-client';

interface State {
  conversations: ConversationDetails[];
  activeConversations: string[];
  socket: Socket | null;
  currentConversationId: string | null;
  usersTyping: UserTyping[];
}

interface Actions {
  setConversations: (conversations: ConversationDetails[]) => void;
  addConversation: (conversations: ConversationDetails) => void;
  clearConversations: () => void;
  setActiveConversations: (active: any) => void;
  clearActive: () => void;
  setSocket: (socket: Socket) => void;
  clearSocket: () => void;
  removeConversation: (id: string) => void;
  getActiveConversations: () => ConversationDetails[];
  addActiveConversation: (id: string) => void;
  removeActiveConversation: (conversationId: string) => void;
  setConversationIsOnline: (userId: string, isOnline: boolean) => void;
  setCurrentConversationId: (conversation: string | null) => void;
  clearCurrentConversationId: () => void;
  setConversationMessages: (
    conversationId: string,
    messages: MessageDetails[]
  ) => void;
  addConversationMessage: (
    conversationId: string,
    message: MessageDetails
  ) => void;
  addUserTyping: (userTyping: UserTyping) => void;
  removeUserTyping: (userTyping: UserTyping) => void;
  clearUserTyping: () => void;
  clearChatState: () => void;
}

export const useChatStore = create<State & Actions>()(
  devtools((set, get) => ({
    conversations: [],
    setConversations: (conversations) => set({ conversations }),
    addConversation: (conversations) =>
      set((state) => ({
        conversations: state.conversations
          ? [...state.conversations, conversations]
          : [conversations]
      })),
    clearConversations: () => set({ conversations: [] }),
    activeConversations: [],
    setActiveConversations: (activeConversations) =>
      set({ activeConversations }),
    clearActive: () => set({ activeConversations: [] }),
    socket: null,
    setSocket: (socket) => set({ socket }),
    clearSocket: () => set({ socket: null }),
    getActiveConversations: () =>
      get().conversations.filter((el) =>
        get().activeConversations.includes(el.id)
      ),
    setConversationIsOnline: (userId, isOnline) =>
      set((state) => ({
        conversations: state.conversations.map((el) =>
          el.userIds.includes(userId)
            ? {
                ...el,
                users: el.users.map((el: AccountDetails) =>
                  el.id === userId
                    ? {
                        ...el,
                        isOnline
                      }
                    : el
                )
              }
            : el
        )
      })),
    currentConversationId: null,
    setCurrentConversationId: (currentConversationId) =>
      set({ currentConversationId }),
    clearCurrentConversationId: () => set({ currentConversationId: null }),
    setConversationMessages: (conversationId, messages) =>
      set((state) => ({
        conversations: state.conversations.map((el) =>
          el.id === conversationId
            ? {
                ...el,
                messages
              }
            : el
        )
      })),
    addConversationMessage: (conversationId, message) =>
      set((state) => ({
        conversations: state.conversations.map((el) =>
          el.id === conversationId
            ? {
                ...el,
                messages: el.messages ? [...el.messages, message] : [message]
              }
            : el
        )
      })),
    usersTyping: [],
    addUserTyping: (userTyping) =>
      set((state) => {
        if (
          state.usersTyping.some(
            (el) =>
              el.userId === userTyping.userId &&
              el.conversationId === userTyping.conversationId
          )
        ) {
          return {
            usersTyping: state.usersTyping
          };
        }

        return {
          usersTyping: state.usersTyping
            ? [...state.usersTyping, userTyping]
            : [userTyping]
        };
      }),
    removeUserTyping: (userTyping) =>
      set((state) => ({
        usersTyping: state.usersTyping
          ? state.usersTyping.filter(
              (el) =>
                el.userId !== userTyping.userId &&
                el.conversationId !== userTyping.conversationId
            )
          : []
      })),
    clearUserTyping: () => set({ usersTyping: [] }),
    removeActiveConversation: (conversationId) =>
      set((state) => ({
        activeConversations: state.activeConversations
          ? state.activeConversations.filter((el) => el !== conversationId)
          : []
      })),
    addActiveConversation: (id) =>
      set((state) => ({
        activeConversations: state.activeConversations
          ? [...state.activeConversations, id]
          : [id]
      })),
    friendRequests: null,
    clearChatState: () =>
      set({
        conversations: [],
        activeConversations: [],
        socket: null,
        currentConversationId: null,
        usersTyping: []
      }),
    removeConversation: (id) =>
      set((state) => ({
        conversations: state.conversations
          ? state.conversations.filter((el) => el.id !== id)
          : [],
        activeConversations: state.activeConversations.filter((el) => el !== id)
      }))
  }))
);
