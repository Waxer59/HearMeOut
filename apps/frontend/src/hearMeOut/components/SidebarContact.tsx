import { Avatar, Button, ContextMenu } from '@radix-ui/themes';

interface Props {
  name: string;
}

export const SidebarContact = ({ name }: Props) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Button
          variant="ghost"
          radius="large"
          className="flex items-center justify-start gap-3 font-bold uppercase text-lg w-full transition">
          <Avatar fallback="G" />
          {name}
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
