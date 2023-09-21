import { Avatar, Badge, Button, ContextMenu } from '@radix-ui/themes';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';

interface Props {
  name: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export const SidebarContact: React.FC<Props> = ({
  name,
  avatarUrl,
  isOnline
}) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Button
          variant="ghost"
          radius="large"
          className="flex items-center justify-start gap-3 font-bold uppercase text-lg w-full transition">
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
        <ContextMenu.Item className="cursor-pointer">
          Remove contact
        </ContextMenu.Item>

        <ContextMenu.Separator />

        <ContextMenu.Item color="red" className="cursor-pointer">
          Block contact
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
