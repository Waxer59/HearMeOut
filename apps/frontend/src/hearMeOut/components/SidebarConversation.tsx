import { Avatar, Badge, Button, ContextMenu } from '@radix-ui/themes';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';
import { useChatStore } from '../../store';
import { closeActiveConversation } from '../../services/hearMeOutAPI';
import { ConversationTypes } from '../../store/types/types';
import { useSocketChatEvents } from '../hooks/useSocketChatEvents';

interface Props {
  id: string;
  name: string;
  avatarUrl?: string;
  isOnline: boolean;
  isActive: boolean;
  type: ConversationTypes;
}

const REMOVE_MESSAGE = {
  [ConversationTypes.chat]: 'Remove contact',
  [ConversationTypes.group]: 'Remove group'
};

export const SidebarConversation: React.FC<Props> = ({
  id,
  name,
  avatarUrl,
  isOnline,
  isActive,
  type
}) => {
  const {
    setCurrentConversationId,
    removeActiveConversation,
    conversations,
    removeConversation,
    currentConversationId
  } = useChatStore((state) => state);
  const { sendRemoveConversation } = useSocketChatEvents();

  const handleConversationClick = async () => {
    const currentConversation = conversations.find((el) => el.id === id)!;
    setCurrentConversationId(currentConversation.id);
  };

  const handleCloseChat = async () => {
    await closeActiveConversation(id);
    removeActiveConversation(id);
  };

  const handleRemoveContact = async () => {
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }

    sendRemoveConversation(id);
    removeConversation(id);
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Button
          variant="ghost"
          radius="large"
          className="flex items-center justify-start gap-3 font-bold uppercase text-lg w-full transition"
          onClick={handleConversationClick}>
          <Avatar fallback={getFallbackAvatarName(name)} src={avatarUrl} />
          {name}
          {type === ConversationTypes.chat &&
            (isOnline ? (
              <Badge color="green" className="ml-auto">
                online
              </Badge>
            ) : (
              <Badge color="gray" className="ml-auto">
                offline
              </Badge>
            ))}
        </Button>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        {isActive && (
          <>
            <ContextMenu.Item
              className="cursor-pointer"
              onClick={handleCloseChat}>
              Close chat
            </ContextMenu.Item>

            <ContextMenu.Separator />
          </>
        )}

        <ContextMenu.Item
          color="red"
          className="cursor-pointer"
          onClick={handleRemoveContact}>
          {REMOVE_MESSAGE[type]}
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
