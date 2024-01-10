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
  chatQueryFilter: string | null;
  replyMessage: MessageDetails | null;
  showGroupSettings: boolean;
  isInActiveConversationsTab: boolean;
}

interface Actions {
  setIsInActiveConversationsTab: (isInActiveConversationsTab: boolean) => void;
  setConversations: (conversations: ConversationDetails[]) => void;
  addConversation: (conversations: ConversationDetails) => void;
  setReplyMessage: (replyMessage: MessageDetails | null) => void;
  clearReplyMessage: () => void;
  clearConversations: () => void;
  setActiveConversations: (active: any) => void;
  clearActive: () => void;
  setSocket: (socket: Socket) => void;
  clearSocket: () => void;
  removeConversation: (id: string) => void;
  deleteConversationMessage: (
    conversationId: string,
    messageId: string
  ) => void;
  updateConversationMessage: (
    conversationId: string,
    messageId: string,
    content: string
  ) => void;
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
  setChatQueryFilter: (query: string | null) => void;
  removeUserTyping: (userTyping: UserTyping) => void;
  clearUserTyping: () => void;
  clearChatState: () => void;
  setShowGroupSettings: (showGroupSettings: boolean) => void;
  updateConversation: (conversation: ConversationDetails) => void;
}

export const useChatStore = create<State & Actions>()(
  devtools((set, get) => ({
    conversations: [],
    activeConversations: [],
    socket: null,
    currentConversationId: null,
    friendRequests: null,
    replyMessage: null,
    showGroupSettings: false,
    isInActiveConversationsTab: true,
    chatQueryFilter: null,
    usersTyping: [],
    setConversations: (conversations) => set({ conversations }),
    addConversation: (conversations) =>
      set((state) => ({
        conversations: state.conversations
          ? [...state.conversations, conversations]
          : [conversations]
      })),
    clearConversations: () => set({ conversations: [] }),
    setActiveConversations: (activeConversations) =>
      set({ activeConversations }),
    clearActive: () => set({ activeConversations: [] }),
    setSocket: (socket) => set({ socket }),
    clearSocket: () => set({ socket: null }),
    getActiveConversations: () =>
      get().conversations.filter((el) =>
        get().activeConversations.includes(el.id)
      ),
    setConversationIsOnline: (userId, isOnline) =>
      set((state) => ({
        conversations: state.conversations.map((el) => ({
          ...el,
          users: el.users.map((el: AccountDetails) =>
            el.id === userId
              ? {
                  ...el,
                  isOnline
                }
              : el
          )
        }))
      })),
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
    clearChatState: () =>
      set({
        conversations: [],
        activeConversations: [],
        socket: null,
        currentConversationId: null,
        usersTyping: [],
        chatQueryFilter: null,
        replyMessage: null,
        showGroupSettings: false,
        isInActiveConversationsTab: true
      }),
    removeConversation: (id) =>
      set((state) => ({
        conversations: state.conversations
          ? state.conversations.filter((el) => el.id !== id)
          : [],
        activeConversations: state.activeConversations.filter((el) => el !== id)
      })),
    setChatQueryFilter: (query) => set({ chatQueryFilter: query }),
    deleteConversationMessage: (conversationId, messageId) =>
      set((state) => ({
        conversations: state.conversations.map((el) =>
          el.id === conversationId
            ? {
                ...el,
                messages: el.messages.filter((el) => el.id !== messageId)
              }
            : el
        )
      })),
    updateConversationMessage: (conversationId, messageId, content) =>
      set((state) => ({
        conversations: state.conversations.map((el) =>
          el.id === conversationId
            ? {
                ...el,
                messages: el.messages.map((el) =>
                  el.id === messageId ? { ...el, content, isEdited: true } : el
                )
              }
            : el
        )
      })),
    setReplyMessage: (replyMessage) => set({ replyMessage }),
    clearReplyMessage: () => set({ replyMessage: null }),
    setShowGroupSettings: (showGroupSettings) => set({ showGroupSettings }),
    updateConversation: (conversation) =>
      set((state) => ({
        conversations: state.conversations.map((el) =>
          el.id === conversation.id ? { ...el, ...conversation } : el
        )
      })),
    setIsInActiveConversationsTab: (isInActiveConversationsTab) =>
      set({
        isInActiveConversationsTab
      })
  }))
);
