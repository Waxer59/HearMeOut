import { Badge, Button, Heading, Tooltip } from '@radix-ui/themes';
import { IconMenu2, IconPhone, IconUsersGroup } from '@tabler/icons-react';
import { ConversationTypes } from '@store/types/types';
import { useAccountStore } from '@store/account';
import { useChatStore } from '@store/chat';
import { useUiStore } from '@store/ui';

export const Title: React.FC = () => {
  const setShowGroupSettings = useUiStore(
    (state) => state.setShowGroupSettings
  );
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const setIsSidebarOpen = useUiStore((state) => state.setIsSidebarOpen);
  const conversations = useChatStore((state) => state.conversations);
  const currentUserId = useAccountStore((state) => state.account)!.id;
  const conversation = conversations.find(
    (el) => el.id === currentConversationId
  )!;
  const userInChat = conversation.users.find(
    (user) => user.id !== currentUserId
  )!;

  const handleCall = () => {};

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
          {conversation?.name ?? userInChat.username}
        </Heading>
      </div>
      <div className="flex items-center gap-5">
        {conversation?.type === ConversationTypes.chat &&
          (userInChat.isOnline ? (
            <Badge color="green">online</Badge>
          ) : (
            <Badge color="gray">offline</Badge>
          ))}
        {conversation?.type === ConversationTypes.group && (
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
