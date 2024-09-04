import { Button } from '@radix-ui/themes';
import { CallLayout } from '@hearmeout/layouts/CallLayout';
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconPhoneOff
} from '@tabler/icons-react';
import { useState } from 'react';
import { useCallStore } from '@store/call';
import { useConversation } from '@/hearMeOut/hooks/useConversation';
import { useSocketChatEvents } from '@/hearMeOut/hooks/useSocketChatEvents';
import {
  ConversationTypes,
  type ConversationDetails
} from '@/store/types/types';
import { UserInCall } from './UserInCall';

interface Props {
  callingConversation: ConversationDetails;
}

export const CallInProgress: React.FC<Props> = ({ callingConversation }) => {
  const { sendUserLeftCall, sendMuteUser, sendUnmuteUser } =
    useSocketChatEvents();
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const { localStream, peerConnection, callConsumersIds, mutedUsers, clear } =
    useCallStore((state) => state);

  const callingConversationId = callingConversation.id;
  const { getAvatar, getName } = useConversation(callingConversationId);

  const isChatConversation =
    callingConversation.type === ConversationTypes.chat;

  // If the conversation is a chat conversation
  // and one user is muted, then the call is muted
  const isUserMuted = isChatConversation && mutedUsers.length > 0;

  const toggleMuteMicrophone = () => {
    if (!peerConnection || !localStream) return;

    // Notify server that the user is muted
    if (isMicrophoneOn) {
      sendMuteUser(callingConversationId);
    } else {
      sendUnmuteUser(callingConversationId);
    }

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
    sendUserLeftCall(callingConversationId);
  };

  return (
    <CallLayout name={getName()} avatar={getAvatar()} isMuted={isUserMuted}>
      <div className="flex gap-4 items-center">
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={toggleMuteMicrophone}>
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
      <ul className="flex gap-4 items-center w-[200px] max-w-[200px] overflow-auto pb-2">
        {!isChatConversation &&
          callConsumersIds.map((consumerId) => {
            const consumer = callingConversation.users.find(
              (user) => user.id === consumerId
            )!;
            const isMuted = mutedUsers.includes(consumerId);

            return (
              <UserInCall
                key={consumer.id}
                name={consumer.username}
                avatar={consumer.avatar}
                isMuted={isMuted}
              />
            );
          })}
      </ul>
    </CallLayout>
  );
};
