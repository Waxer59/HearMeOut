import { Avatar, Badge, Button, ContextMenu } from '@radix-ui/themes';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';
import { useChatStore } from '../../store';

interface Props {
  id: string;
  name: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export const SidebarConversation: React.FC<Props> = ({
  id,
  name,
  avatarUrl,
  isOnline
}) => {
  const { setCurrentConversationId, conversations } = useChatStore(
    (state) => state
  );

  const handleConversationClick = async () => {
    const currentConversation = conversations.find((el) => el.id === id)!;
    setCurrentConversationId(currentConversation.id);
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
        <ContextMenu.Item className="cursor-pointer">
          Close chat
        </ContextMenu.Item>

        <ContextMenu.Separator />

        <ContextMenu.Item color="red" className="cursor-pointer">
          Remove contact
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
