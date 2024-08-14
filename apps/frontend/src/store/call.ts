import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState: State = {
  localStream: null,
  peerConnection: null,
  remoteStream: null,
  callingId: null,
  isCalling: false
};

interface State {
  localStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  remoteStream: MediaStream | null;
  callingId: string | null;
  isCalling: boolean;
}

interface Actions {
  setLocalStream: (stream: MediaStream) => void;
  setPeerConnection: (peerConnection: RTCPeerConnection) => void;
  setRemoteStream: (stream: MediaStream) => void;
  setCallingId: (callingId: string) => void;
  setIsCalling: (isCalling: boolean) => void;
  endCall: () => void;
  clear: () => void;
}

export const useCallStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setLocalStream: (stream) => set({ localStream: stream }),
    setPeerConnection: (peerConnection) => set({ peerConnection }),
    setRemoteStream: (stream) => set({ remoteStream: stream }),
    setCallingId: (callingId) => set({ callingId, isCalling: true }),
    setIsCalling: (isCalling) => set({ isCalling }),
    endCall: () => set({ callingId: null, isCalling: false }),
    clear: () => set({ ...initialState })
  }))
);
