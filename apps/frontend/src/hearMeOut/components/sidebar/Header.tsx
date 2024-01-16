import { Button, Heading, TextField, Tooltip } from '@radix-ui/themes';
import { IconSearch, IconX } from '@tabler/icons-react';
import { Options } from '..';
import { useChatStore, useUiStore } from '../../../store';
import type { InputEvent } from '../../../types/types';

export const Header: React.FC = () => {
  const setChatQueryFilter = useChatStore((state) => state.setChatQueryFilter);
  const setIsSidebarOpen = useUiStore((state) => state.setIsSidebarOpen);
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);

  const handleInputChange = (e: InputEvent) => {
    const query = e.target.value;
    setChatQueryFilter(query === '' ? null : query);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Heading as="h3" weight="bold" className="text-lg">
          Channels
        </Heading>
        <div className="flex items-center gap-10">
          <Options />
          <Tooltip content="Close">
            <Button
              onClick={handleCloseSidebar}
              className="cursor-pointer transition-colors md:hidden"
              variant="ghost"
              color="red">
              <IconX />
            </Button>
          </Tooltip>
        </div>
      </div>
      <TextField.Root size="3" variant="soft" color="gray">
        <TextField.Slot>
          <IconSearch size={16} />
        </TextField.Slot>
        <TextField.Input placeholder="Search" onChange={handleInputChange} />
      </TextField.Root>
    </header>
  );
};
