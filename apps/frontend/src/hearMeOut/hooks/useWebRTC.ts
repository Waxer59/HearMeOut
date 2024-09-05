import { useCallStore } from '@/store/call';
import { toast } from 'sonner';
import { useSocketChatEvents } from './useSocketChatEvents';
import type { ConversationDetails } from '@/store/types/types';

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ],
  iceCandidatePoolSize: 10
};

export const useWebRTC = () => {
  const { sendOffer, sendCandidate } = useSocketChatEvents();
  const localStream = useCallStore((state) => state.localStream);
  const setLocalStream = useCallStore((state) => state.setLocalStream);
  const setPeerConnection = useCallStore((state) => state.setPeerConnection);
  const setCallingConversation = useCallStore(
    (state) => state.setCallingConversation
  );

  const createPeerConnection = async (conversation: ConversationDetails) => {
    const peerConnection = new RTCPeerConnection(servers);
    const conversationId = conversation.id;

    setPeerConnection(peerConnection);

    if (!localStream) {
      const mediaDevices = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      if (!mediaDevices) {
        toast.error('Please allow access to your microphone.');
        return;
      }

      // Add local stream to peer connection
      mediaDevices.getTracks().forEach((track) => {
        peerConnection.addTrack(track, mediaDevices);
      });

      setLocalStream(mediaDevices);
    }

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        sendCandidate(conversationId, JSON.stringify(candidate));
      }
    };

    peerConnection.ontrack = (event) => {
      const [streams] = event.streams;
      // Play user microphone
      const audioTrack = streams.getAudioTracks()[0];
      const audioStream = new MediaStream([audioTrack]);
      const audio = new Audio();
      audio.srcObject = audioStream;
      audio.play();
    };

    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    setCallingConversation(conversation);
    sendOffer(conversationId, JSON.stringify(offer));
  };

  return {
    createPeerConnection
  };
};
