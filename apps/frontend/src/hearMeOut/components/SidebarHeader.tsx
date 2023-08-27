import {
  Button,
  Dialog,
  Heading,
  IconButton,
  TextField,
  Tooltip
} from '@radix-ui/themes';
import {
  IconPlus,
  IconSearch,
  IconUserPlus,
  IconUsersGroup
} from '@tabler/icons-react';

export const SidebarHeader = () => {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Heading as="h3" weight="bold" className="text-lg">
          Channels
        </Heading>
        <Dialog.Root>
          <Tooltip content="Create channel">
            <Dialog.Trigger>
              <IconButton className="bg-primary" radius="large">
                <IconPlus />
              </IconButton>
            </Dialog.Trigger>
          </Tooltip>

          <Dialog.Content>
            <Dialog.Title>Create channel</Dialog.Title>
            <Dialog.Description>
              Add a contact or create a group
            </Dialog.Description>
            <div className="flex flex-col mt-3 gap-2">
              <Button variant="soft" color="grass" size="3" className="w-full">
                Add contact
                <IconUserPlus />
              </Button>
              <Button variant="soft" size="3" color="blue" className="w-full">
                Create group
                <IconUsersGroup />
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Root>
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
