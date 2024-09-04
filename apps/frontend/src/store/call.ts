import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ConversationDetails } from './types/types';

const initialState: State = {
  localStream: null,
  peerConnection: null,
  callConsumersIds: [],
  mutedUsers: [],
  incommingCallsIds: [],
  callingConversation: null,
  isSignaling: false,
  isCallinProgress: false
};

interface State {
  localStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  incommingCallsIds: string[];
  mutedUsers: string[];
  callConsumersIds: string[];
  callingConversation: ConversationDetails | null;
  isSignaling: boolean;
  isCallinProgress: boolean;
}

interface Actions {
  setLocalStream: (stream: MediaStream) => void;
  addMutedUser: (userId: string) => void;
  removeIncommingCallId: (callId: string) => void;
  addIncommingCallId: (callId: string) => void;
  setIncommingCallsIds: (incommingCallsIds: string[]) => void;
  removeMutedUser: (userId: string) => void;
  setCallConsumersIds: (callConsumersIds: string[]) => void;
  addCallConsumerId: (callConsumerId: string) => void;
  removeCallConsumerId: (userId: string) => void;
  setPeerConnection: (peerConnection: RTCPeerConnection) => void;
  setCallingConversation: (callingConversation: ConversationDetails) => void;
  setIsCallinProgress: (isCallinProgress: boolean) => void;
  setIsSignaling: (isSignaling: boolean) => void;
  clear: () => void;
}

export const useCallStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setLocalStream: (stream) => set({ localStream: stream }),
    setIsSignaling: (isSignaling) => set({ isSignaling }),
    setIncommingCallsIds: (incommingCallsIds) => set({ incommingCallsIds }),
    addIncommingCallId: (userId) =>
      set((state) => ({
        incommingCallsIds: [...state.incommingCallsIds, userId]
      })),
    removeIncommingCallId: (userId) =>
      set((state) => ({
        incommingCallsIds: state.incommingCallsIds.filter((id) => id !== userId)
      })),
    setIsCallinProgress: (isCallinProgress) =>
      set({ isCallinProgress, isSignaling: false }),
    setCallConsumersIds: (callConsumersIds) => set({ callConsumersIds }),
    addCallConsumerId: (callConsumerId) =>
      set((state) => ({
        callConsumersIds: [...state.callConsumersIds, callConsumerId]
      })),
    removeCallConsumerId: (userId) =>
      set((state) => ({
        callConsumersIds: state.callConsumersIds.filter(
          (consumerId) => consumerId !== userId
        )
      })),
    setCallingConversation: (callingConversation) =>
      set({ callingConversation }),
    addMutedUser: (userId) =>
      set((state) => ({ mutedUsers: [...state.mutedUsers, userId] })),
    removeMutedUser: (userId) =>
      set((state) => ({
        mutedUsers: state.mutedUsers.filter((id) => id !== userId)
      })),
    setPeerConnection: (peerConnection) => set({ peerConnection }),
    clear: () => set({ ...initialState })
  }))
);
