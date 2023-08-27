import { IconButton, Text, TextField } from '@radix-ui/themes';
import { IconPlus, IconSearch } from '@tabler/icons-react';

export const SidebarHeader = () => {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Text weight="bold">Channels</Text>
        <IconButton className="bg-primary" radius="large">
          <IconPlus size={24} />
        </IconButton>
      </div>
      <TextField.Root size="3" variant="soft" color="gray">
        <TextField.Slot>
          <IconSearch size={16} />
        </TextField.Slot>
        <TextField.Input placeholder="Search" />
      </TextField.Root>
    </header>
  );
};
