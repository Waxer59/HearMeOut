import { Heading, TextField } from '@radix-ui/themes';
import { IconSearch } from '@tabler/icons-react';
import { SidebarOptions } from '.';

export const SidebarHeader = () => {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Heading as="h3" weight="bold" className="text-lg">
          Channels
        </Heading>
        <SidebarOptions />
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
