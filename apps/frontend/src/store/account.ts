import { create } from 'zustand';
import {
  ThemeEnum,
  type AccountDetails,
  type FriendRequestDetails,
  type SettingsDetails
} from './types/types';
import { devtools } from 'zustand/middleware';

interface State {
  account: AccountDetails | null;
  isAuthenticated: boolean;
  settings: SettingsDetails;
  friendRequests: FriendRequestDetails[];
  friendRequestsOutgoing: FriendRequestDetails[];
}

interface Actions {
  setAccount: (a: AccountDetails) => void;
  updateAccount: (a: Partial<AccountDetails>) => void;
  clearAccount: () => void;
  clearSettings: () => void;
  updateSettings: (s: SettingsDetails) => void;
  setSettings: (s: SettingsDetails) => void;
  setFriendRequests: (friendRequests: FriendRequestDetails[]) => void;
  addFriendRequest: (friendRequest: FriendRequestDetails) => void;
  removeFriendRequest: (friendRequestId: string) => void;
  clearFriendRequests: () => void;
  setFriendRequestsOutgoing: (friendRequests: FriendRequestDetails[]) => void;
  addFriendRequestOutgoing: (friendRequest: FriendRequestDetails) => void;
  removeFriendRequestOutgoing: (friendRequestId: string) => void;
  clearFriendRequestsOutgoing: () => void;
  clearAccountState: () => void;
  removeConversationNotification: (conversationId: string) => void;
  addConversationNotification: (conversationId: string) => void;
}

export const useAccountStore = create<State & Actions>()(
  devtools((set) => ({
    account: null,
    setAccount: (a) => set({ account: a, isAuthenticated: true }),
    clearAccount: () => set({ account: null, isAuthenticated: false }),
    isAuthenticated: false,
    settings: {
      theme: ThemeEnum.DARK
    },
    clearSettings: () =>
      set({
        settings: {
          theme: ThemeEnum.DARK
        }
      }),
    updateSettings: (s) =>
      set((state) => ({
        settings: {
          ...state.settings,
          ...s
        }
      })),
    setSettings: (s) => set({ settings: s }),
    friendRequests: [],
    setFriendRequests: (friendRequests) => set({ friendRequests }),
    addFriendRequest: (friendRequest) =>
      set((state) => ({
        friendRequests: state.friendRequests
          ? [...state.friendRequests, friendRequest]
          : [friendRequest]
      })),
    removeFriendRequest: (friendRequestId) =>
      set((state) => ({
        friendRequests: state.friendRequests
          ? state.friendRequests.filter((el) => el.id !== friendRequestId)
          : []
      })),
    clearFriendRequests: () => set({ friendRequests: [] }),
    friendRequestsOutgoing: [],
    setFriendRequestsOutgoing: (friendRequestsOutgoing) =>
      set({ friendRequestsOutgoing }),
    addFriendRequestOutgoing: (friendRequest) =>
      set((state) => ({
        friendRequestsOutgoing: state.friendRequestsOutgoing
          ? [...state.friendRequestsOutgoing, friendRequest]
          : [friendRequest]
      })),
    removeFriendRequestOutgoing: (friendRequestId) =>
      set((state) => ({
        friendRequestsOutgoing: state.friendRequestsOutgoing
          ? state.friendRequestsOutgoing.filter(
              (el) => el.id !== friendRequestId
            )
          : []
      })),
    clearFriendRequestsOutgoing: () => set({ friendRequestsOutgoing: [] }),
    clearAccountState: () =>
      set({
        account: null,
        isAuthenticated: false,
        settings: {
          theme: ThemeEnum.DARK
        },
        friendRequests: [],
        friendRequestsOutgoing: []
      }),
    updateAccount: (a) =>
      set((state) => ({
        account: {
          ...state.account,
          ...(a as AccountDetails)
        }
      })),
    removeConversationNotification: (conversationId) =>
      set((state) => ({
        account: {
          ...state.account!,
          conversationNotificationIds:
            state.account!.conversationNotificationIds?.filter(
              (id) => id !== conversationId
            )
        }
      })),
    addConversationNotification: (conversationId) =>
      set((state) => ({
        account: {
          ...state.account!,
          conversationNotificationIds: [
            ...(state.account?.conversationNotificationIds ?? []),
            conversationId
          ]
        }
      }))
  }))
);
