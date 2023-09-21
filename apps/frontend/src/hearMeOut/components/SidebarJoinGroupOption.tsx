import { Button, TextField } from '@radix-ui/themes';
import { IconSend } from '@tabler/icons-react';

export const SidebarJoinGroupOption = () => {
  return (
    <div className="flex items-center gap-2">
      <TextField.Root size="3" variant="soft" color="gray" className="w-full">
        <TextField.Input placeholder="Group code" />
      </TextField.Root>
      <Button color="blue">
        <IconSend />
      </Button>
    </div>
  );
};
