import { create } from 'zustand';
import type {
  AccountDetails,
  FriendRequestDetails,
  SettingsDetails
} from './types/types';
import { devtools } from 'zustand/middleware';

interface State {
  account: AccountDetails | null;
  isAuthenticated: boolean;
  settings: SettingsDetails | null;
  friendRequests: FriendRequestDetails[];
  friendRequestsOutgoing: FriendRequestDetails[];
}

interface Actions {
  setAccount: (a: AccountDetails) => void;
  updateAccount: (a: Partial<AccountDetails>) => void;
  clearAccount: () => void;
  clearSettings: () => void;
  updateSettings: (s: SettingsDetails) => void;
  setFriendRequests: (friendRequests: FriendRequestDetails[]) => void;
  addFriendRequest: (friendRequest: FriendRequestDetails) => void;
  removeFriendRequest: (friendRequestId: string) => void;
  clearFriendRequests: () => void;
  setFriendRequestsOutgoing: (friendRequests: FriendRequestDetails[]) => void;
  addFriendRequestOutgoing: (friendRequest: FriendRequestDetails) => void;
  removeFriendRequestOutgoing: (friendRequestId: string) => void;
  clearFriendRequestsOutgoing: () => void;
  clearAccountState: () => void;
}

export const useAccountStore = create<State & Actions>()(
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
      })),
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
        settings: null,
        friendRequests: [],
        friendRequestsOutgoing: []
      }),
    updateAccount: (a) =>
      set((state) => ({
        account: {
          ...state.account,
          ...(a as AccountDetails)
        }
      }))
  }))
);
