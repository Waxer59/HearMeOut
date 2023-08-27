import { Avatar, Button, Text, Tooltip } from '@radix-ui/themes';
import { IconSettings } from '@tabler/icons-react';

export const SidebarProfile = () => {
  return (
    <div className="mt-auto mb-4 flex items-center">
      <Text
        weight="bold"
        className="flex items-center justify-start gap-3 font-bold uppercase text-lg w-full transition">
        <Avatar radius="large" fallback="T" />
        Test
      </Text>
      <Tooltip content="Settings">
        <Button variant="ghost" className="transition">
          <IconSettings size={24} className="opacity-70" />
        </Button>
      </Tooltip>
    </div>
  );
};
