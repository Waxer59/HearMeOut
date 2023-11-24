import { Avatar, Button, Heading, Badge } from '@radix-ui/themes';
import { IconDoorExit, IconX } from '@tabler/icons-react';
import { useState } from 'react';

export const GroupSettings = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <aside
      className={`bg-secondary w-80 rounded-tl-3xl rounded-bl-3xl overflow-auto absolute right-0 h-full ${
        isOpen ? 'animation-slide' : 'animate-slideReverse'
      }`}>
      <Button
        variant="ghost"
        color="red"
        className="cursor-pointer transition block mt-6 ml-6"
        onClick={handleClose}>
        <IconX />
      </Button>
      <div className="flex flex-col justify-center gap-5 mt-5 w-full">
        <Avatar fallback="GN" size="9" className="mx-auto" />
        <Heading as="h3" className="mx-auto max-w-[10ch]">
          123456789012345678901234
        </Heading>
      </div>
      <ul className="mt-7 px-5">
        <li className="flex items-center justify-between hover:bg-primary p-2 rounded transition-[background] duration-300 cursor-pointer">
          <div className="flex gap-2 items-center">
            <Avatar fallback="W" size="4" />
            <span className="uppercase font-bold truncate max-w-[16ch]">
              123456789012345678901234567890123456789
            </span>
          </div>
          <div>
            <Badge className="uppercase" color="green">
              admin
            </Badge>
          </div>
        </li>
      </ul>
      <div className="flex justify-center mt-8">
        <Button
          className="transition-[background] cursor-pointer"
          color="red"
          variant="ghost">
          <span className="uppercase font-bold">leave group</span>
          <IconDoorExit />
        </Button>
      </div>
    </aside>
  );
};
