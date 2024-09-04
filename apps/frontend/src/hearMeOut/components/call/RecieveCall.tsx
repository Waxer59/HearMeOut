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
  const { sendUserLeftCall } = useSocketChatEvents();
  const clearCallStore = useCallStore((state) => state.clear);
  const setIsCallinProgress = useCallStore(
    (state) => state.setIsCallinProgress
  );
  const { createPeerConnection } = useWebRTC();

  const handleAcceptCall = () => {
    setIsCallinProgress(true);
    createPeerConnection(callingConversation);
  };

  const handleEndCall = () => {
    sendUserLeftCall(callingConversation.id);
    clearCallStore();
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
