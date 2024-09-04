import { IconPhoneOff } from '@tabler/icons-react';
import { CallLayout } from '@hearmeout/layouts/CallLayout';
import { Button } from '@radix-ui/themes';
import { useConversation } from '@/hearMeOut/hooks/useConversation';
import type { ConversationDetails } from '@/store/types/types';
import { useSocketChatEvents } from '@/hearMeOut/hooks/useSocketChatEvents';
import { useCallStore } from '@/store/call';

interface Props {
  callingConversation: ConversationDetails;
}

export const MakeCall: React.FC<Props> = ({ callingConversation }) => {
  const { getAvatar, getName } = useConversation(callingConversation.id);
  const { sendUserLeftCall } = useSocketChatEvents();
  const clearCallStore = useCallStore((state) => state.clear);

  const handleEndCall = () => {
    sendUserLeftCall(callingConversation.id);
    clearCallStore();
  };

  return (
    <CallLayout name={getName()} avatar={getAvatar()}>
      <Button
        color="red"
        variant="soft"
        className="cursor-pointer w-full"
        onClick={handleEndCall}>
        <IconPhoneOff />
      </Button>
    </CallLayout>
  );
};
