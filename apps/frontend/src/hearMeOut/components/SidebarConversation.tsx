import { Avatar, Badge, Button, ContextMenu } from '@radix-ui/themes';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';
import { useChatStore } from '../../store';
import { closeActiveConversation } from '../../services/hearMeOutAPI';

interface Props {
  id: string;
  name: string;
  avatarUrl?: string;
  isOnline: boolean;
  isActive: boolean;
}

export const SidebarConversation: React.FC<Props> = ({
  id,
  name,
  avatarUrl,
  isOnline,
  isActive
}) => {
  const { setCurrentConversationId, removeActiveConversation, conversations } =
    useChatStore((state) => state);

  const handleConversationClick = async () => {
    const currentConversation = conversations.find((el) => el.id === id)!;
    setCurrentConversationId(currentConversation.id);
  };

  const handleCloseChat = async () => {
    await closeActiveConversation(id);
    removeActiveConversation(id);
  };

  const handleRemoveContact = async () => {};

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
          {isOnline ? (
            <Badge color="green" className="ml-auto">
              online
            </Badge>
          ) : (
            <Badge color="gray" className="ml-auto">
              offline
            </Badge>
          )}
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
          Remove contact
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
