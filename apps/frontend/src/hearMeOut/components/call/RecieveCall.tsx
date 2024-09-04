import { Button } from '@radix-ui/themes';
import { IconPhone, IconPhoneOff } from '@tabler/icons-react';
import { CallLayout } from '@hearmeout/layouts/CallLayout';
import type { ConversationDetails } from '@/store/types/types';
import { useConversation } from '@/hearMeOut/hooks/useConversation';
import { useSocketChatEvents } from '@/hearMeOut/hooks/useSocketChatEvents';
import { useCallStore } from '@/store/call';
import { useWebRTC } from '@/hearMeOut/hooks/useWebRTC';

interface Props {
  callingConversation: ConversationDetails;
}

export const RecieveCall: React.FC<Props> = ({ callingConversation }) => {
  const { getAvatar, getName } = useConversation(callingConversation.id);
  const { sendDeclineCall } = useSocketChatEvents();
  const setIsCallinProgress = useCallStore(
    (state) => state.setIsCallinProgress
  );
  const incommingCallsIds = useCallStore((state) => state.incommingCallsIds);
  const setCallingConversation = useCallStore(
    (state) => state.setCallingConversation
  );
  const setIncommingCallsIds = useCallStore(
    (state) => state.setIncommingCallsIds
  );
  const removeIncommingCallId = useCallStore(
    (state) => state.removeIncommingCallId
  );
  const { createPeerConnection } = useWebRTC();

  const handleAcceptCall = () => {
    // Decline all incoming calls
    incommingCallsIds.forEach((callId) => {
      if (callId === callingConversation.id) return;
      sendDeclineCall(callId);
    });

    // Remove all incoming calls
    setIncommingCallsIds([]);
    setIsCallinProgress(true);
    setCallingConversation(callingConversation);
    removeIncommingCallId(callingConversation.id);
    createPeerConnection(callingConversation);
  };

  const handleEndCall = () => {
    sendDeclineCall(callingConversation.id);
    removeIncommingCallId(callingConversation.id);

    // If the are not more incoming calls
    // then setIsRecevingCall to false
    if (incommingCallsIds.length === 0) {
      setIsCallinProgress(false);
    }
  };

  return (
    <CallLayout name={getName()} avatar={getAvatar()}>
      <div className="flex gap-4 items-center">
        <Button
          color="green"
          variant="soft"
          className="cursor-pointer"
          onClick={handleAcceptCall}>
          <IconPhone />
        </Button>
        <Button
          color="red"
          variant="soft"
          className="cursor-pointer"
          onClick={handleEndCall}>
          <IconPhoneOff />
        </Button>
      </div>
    </CallLayout>
  );
};
