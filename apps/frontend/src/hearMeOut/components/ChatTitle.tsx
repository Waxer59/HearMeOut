import { Button, Heading } from '@radix-ui/themes';
import { IconUsersGroup } from '@tabler/icons-react';

export const ChatTitle = () => {
  return (
    <div className="flex justify-end items-center pr-20 pl-[70px] pt-5 py-4 shadow-[0px_4px_4px_0px_#00000040]">
      <Heading as="h2" weight="bold" className="text-lg text-start w-full">
        Front-end developers
      </Heading>
      <Button variant="ghost">
        <IconUsersGroup />
      </Button>
    </div>
  );
};
