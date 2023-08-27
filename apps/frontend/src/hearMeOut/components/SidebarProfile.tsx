import { Avatar, Button, DropdownMenu, Text, Tooltip } from '@radix-ui/themes';
import { IconLogout, IconSettings, IconUserCircle } from '@tabler/icons-react';

export const SidebarProfile = () => {
  return (
    <div className="mt-auto pt-3 mb-4 flex items-center">
      <Text
        weight="bold"
        className="flex items-center justify-start gap-3 font-bold uppercase text-lg w-full transition">
        <Avatar radius="large" fallback="T" />
        Test
      </Text>

      <DropdownMenu.Root>
        <Tooltip content="Settings">
          <DropdownMenu.Trigger>
            <Button variant="ghost" className="transition">
              <IconSettings size={24} className="opacity-70" />
            </Button>
          </DropdownMenu.Trigger>
        </Tooltip>
        <DropdownMenu.Content>
          <DropdownMenu.Item className="cursor-pointer">
            <IconUserCircle />
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            color="red"
            className="flex items-center gap-2 cursor-pointer">
            <IconLogout />
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};
