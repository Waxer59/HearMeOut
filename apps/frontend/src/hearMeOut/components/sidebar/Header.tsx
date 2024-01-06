import { Heading, TextField } from '@radix-ui/themes';
import { IconSearch } from '@tabler/icons-react';
import { Options } from '..';
import { useChatStore } from '../../../store';
import type { InputEvent } from '../../../types/types';

export const Header: React.FC = () => {
  const setChatQueryFilter = useChatStore((state) => state.setChatQueryFilter);

  const handleInputChange = (e: InputEvent) => {
    const query = e.target.value;
    setChatQueryFilter(query === '' ? null : query);
  };

  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Heading as="h3" weight="bold" className="text-lg">
          Channels
        </Heading>
        <Options />
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
