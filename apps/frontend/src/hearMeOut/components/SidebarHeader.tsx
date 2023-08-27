import { Heading, IconButton, TextField, Tooltip } from '@radix-ui/themes';
import { IconPlus, IconSearch } from '@tabler/icons-react';

export const SidebarHeader = () => {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Heading as="h3" weight="bold" className="text-lg">
          Channels
        </Heading>
        <Tooltip content="Create channel">
          <IconButton className="bg-primary" radius="large">
            <IconPlus size={24} />
          </IconButton>
        </Tooltip>
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
