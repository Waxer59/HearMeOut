import { Button } from '@radix-ui/themes';
import { CallLayout } from '@hearmeout/layouts/CallLayout';
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconPhoneOff
} from '@tabler/icons-react';
import { useState } from 'react';
import { useCallStore } from '@store/call';
import { useChatStore } from '@store/chat';
import { useConversation } from '@/hearMeOut/hooks/useConversation';
import { useSocketChatEvents } from '@/hearMeOut/hooks/useSocketChatEvents';

export const CallInProgress: React.FC = () => {
  const { sendEndCall } = useSocketChatEvents();
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const clear = useCallStore((state) => state.clear);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const { getAvatar, getName } = useConversation(currentConversationId!);
  const peerConnection = useCallStore((state) => state.peerConnection);
  const localStream = useCallStore((state) => state.localStream);

  const handleMuteMicrophone = () => {
    if (!peerConnection || !localStream) return;

    // Toogle microphone mute
    localStream.getAudioTracks()[0].enabled = !isMicrophoneOn;

    setIsMicrophoneOn(!isMicrophoneOn);
  };

  const handleEndCall = () => {
    if (!peerConnection) return;

    // Stop local stream
    peerConnection.getSenders().forEach((sender) => sender?.track?.stop());

    // Close peer connection
    peerConnection.close();

    // Clear call store
    clear();

    // Notify server that the call is ended
    sendEndCall(currentConversationId!);
  };

  return (
    <CallLayout name={getName()} avatar={getAvatar()}>
      <div className="flex gap-4 items-center">
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={handleMuteMicrophone}>
          {isMicrophoneOn ? <IconMicrophone /> : <IconMicrophoneOff />}
        </Button>
        <Button
          color="red"
          variant="soft"
          className="cursor-pointer"
          onClick={handleEndCall}>
          <IconPhoneOff />
        </Button>
      </div>
      <div className="flex gap-4 items-center w-[200px] max-w-[200px] overflow-auto pb-2">
        {/* <UserInCall name="Hugo" /> */}
      </div>
    </CallLayout>
  );
};
