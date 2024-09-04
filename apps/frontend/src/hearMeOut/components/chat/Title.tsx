import { Badge, Button, Heading, Tooltip } from '@radix-ui/themes';
import { IconMenu2, IconPhone, IconUsersGroup } from '@tabler/icons-react';
import { ConversationTypes } from '@store/types/types';
import { useChatStore } from '@store/chat';
import { useUiStore } from '@store/ui';
import { useCallStore } from '@store/call';
import { useWebRTC } from '@/hearMeOut/hooks/useWebRTC';

interface Props {
  name: string;
  isOnline: boolean;
  conversationType: ConversationTypes;
}

export const Title: React.FC<Props> = ({
  name,
  isOnline,
  conversationType
}) => {
  const setShowGroupSettings = useUiStore(
    (state) => state.setShowGroupSettings
  );
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const conversations = useChatStore((state) => state.conversations);
  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const setIsSidebarOpen = useUiStore((state) => state.setIsSidebarOpen);
  const setIsSignaling = useCallStore((state) => state.setIsSignaling);
  const { createPeerConnection } = useWebRTC();

  const handleCall = async () => {
    if (!currentConversation) {
      return;
    }

    setIsSignaling(true);
    createPeerConnection(currentConversation);
  };

  const handleShowGroupSettings = () => {
    setShowGroupSettings(true);
  };

  const toggleShowSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex justify-between items-center px-10 md:px-20 pt-5 py-4 shadow-[0px_4px_4px_0px_#00000040] uppercase">
      <div className="flex items-center justify-between gap-5">
        <Button
          variant="ghost"
          className="cursor-pointer md:hidden"
          onClick={toggleShowSidebar}>
          <IconMenu2 />
        </Button>
        <Heading as="h2" weight="bold" className="text-lg">
          {name}
        </Heading>
      </div>
      <div className="flex items-center gap-5">
        {conversationType === ConversationTypes.chat &&
          (isOnline ? (
            <Badge color="green">online</Badge>
          ) : (
            <Badge color="gray">offline</Badge>
          ))}
        {conversationType === ConversationTypes.group && (
          <Tooltip content="Members">
            <Button
              variant="ghost"
              className="transition cursor-pointer"
              onClick={handleShowGroupSettings}>
              <IconUsersGroup />
            </Button>
          </Tooltip>
        )}
        <Button className="cursor-pointer" variant="ghost" onClick={handleCall}>
          <IconPhone />
        </Button>
      </div>
    </div>
  );
};
