import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CallConsumerDetails } from './types/types';

const initialState: State = {
  localStream: null,
  peerConnection: null,
  callConsumers: [],
  callingId: null,
  isCalling: false
};

interface State {
  localStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  callConsumers: CallConsumerDetails[];
  callingId: string | null;
  isCalling: boolean;
}

interface Actions {
  setLocalStream: (stream: MediaStream) => void;
  setCallConsumers: (callConsumers: CallConsumerDetails[]) => void;
  addCallConsumer: (callConsumer: CallConsumerDetails) => void;
  removeCallConsumer: (userId: string) => void;
  setPeerConnection: (peerConnection: RTCPeerConnection) => void;
  setCallingId: (callingId: string) => void;
  setIsCalling: (isCalling: boolean) => void;
  clear: () => void;
}

export const useCallStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setLocalStream: (stream) => set({ localStream: stream }),
    setCallConsumers: (callConsumers) => set({ callConsumers }),
    addCallConsumer: (callConsumer) =>
      set((state) => ({
        callConsumers: [...state.callConsumers, callConsumer]
      })),
    removeCallConsumer: (userId) =>
      set((state) => ({
        callConsumers: state.callConsumers.filter(
          (consumer) => consumer.user.id !== userId
        )
      })),
    setCallingId: (callingId) => set({ callingId, isCalling: true }),
    setPeerConnection: (peerConnection) => set({ peerConnection }),
    setIsCalling: (isCalling) => set({ isCalling }),
    clear: () => set({ ...initialState })
  }))
);
