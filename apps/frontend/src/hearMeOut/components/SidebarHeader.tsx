import {
  Avatar,
  Button,
  Dialog,
  Heading,
  IconButton,
  Select,
  Text,
  TextField,
  Tooltip
} from '@radix-ui/themes';
import {
  IconChevronLeft,
  IconPlus,
  IconSearch,
  IconSend,
  IconUserPlus,
  IconUsers,
  IconUsersGroup,
  IconX
} from '@tabler/icons-react';
import { useState } from 'react';
import { SidebarAddContactOption } from './';

const USERS = ['SERGIO', 'JOSE', 'JUAN', 'JUAN PABLO'];

enum DialogSelectionEnum {
  ADD_CONTACT = 'ADD_CONTACT',
  CREATE_GROUP = 'CREATE_GROUP',
  JOIN_GROUP = 'JOIN_GROUP',
  NONE = 'NONE'
}

export const SidebarHeader = () => {
  const [dialogSelection, setDialogSelection] = useState<DialogSelectionEnum>(
    DialogSelectionEnum.NONE
  );

  const onResetDialog = () => {
    setDialogSelection(DialogSelectionEnum.NONE);
  };

  const onAddContactClick = () => {
    setDialogSelection(DialogSelectionEnum.ADD_CONTACT);
  };

  const onCreateGroupClick = () => {
    setDialogSelection(DialogSelectionEnum.CREATE_GROUP);
  };

  const onJoinGroupClick = () => {
    setDialogSelection(DialogSelectionEnum.JOIN_GROUP);
  };

  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Heading as="h3" weight="bold" className="text-lg">
          Channels
        </Heading>
        <Dialog.Root onOpenChange={onResetDialog}>
          <Tooltip content="Create channel">
            <Dialog.Trigger>
              <IconButton className="bg-primary" radius="large">
                <IconPlus />
              </IconButton>
            </Dialog.Trigger>
          </Tooltip>

          <Dialog.Content>
            <div className="flex items-center justify-between w-full mb-6 max-w-[532px]">
              {dialogSelection !== DialogSelectionEnum.NONE && (
                <Button onClick={onResetDialog} variant="ghost">
                  <IconChevronLeft />
                </Button>
              )}

              <Dialog.Title as="h2" className="text-center w-full m-0">
                {dialogSelection === DialogSelectionEnum.ADD_CONTACT
                  ? 'Add contact'
                  : dialogSelection === DialogSelectionEnum.CREATE_GROUP
                  ? 'Create group'
                  : dialogSelection === DialogSelectionEnum.JOIN_GROUP
                  ? 'Join group'
                  : 'Create channel'}
              </Dialog.Title>
              <Dialog.Close className="cursor-pointer">
                <Button variant="ghost" color="red" className="transition">
                  <IconX />
                </Button>
              </Dialog.Close>
            </div>
            {dialogSelection === DialogSelectionEnum.NONE && (
              <div className="flex flex-col mt-3 gap-2">
                <Button
                  variant="soft"
                  color="grass"
                  size="3"
                  className="w-full"
                  onClick={onAddContactClick}>
                  Add contact
                  <IconUserPlus />
                </Button>
                <Button
                  variant="soft"
                  size="3"
                  color="blue"
                  className="w-full"
                  onClick={onCreateGroupClick}>
                  Create group
                  <IconUsersGroup />
                </Button>
                <Button
                  variant="soft"
                  size="3"
                  color="ruby"
                  className="w-full"
                  onClick={onJoinGroupClick}>
                  Join group
                  <IconUsers />
                </Button>
              </div>
            )}
            {dialogSelection === DialogSelectionEnum.ADD_CONTACT && (
              <SidebarAddContactOption />
            )}
            {dialogSelection === DialogSelectionEnum.CREATE_GROUP && (
              <div className="flex flex-col gap-8">
                <TextField.Root size="3" variant="soft" color="gray">
                  <TextField.Input placeholder="Group name" />
                </TextField.Root>
                <div className="w-full flex flex-col gap-3">
                  <Heading as="h3" size="3">
                    Add users to group
                  </Heading>
                  <Select.Root>
                    <Select.Trigger placeholder="Contacts" />
                    <Select.Content color="blue">
                      {USERS.map((el, idx) => (
                        <Select.Item value={el} key={idx}>
                          {el}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <Heading as="h3" size="3">
                    Selected contacts
                  </Heading>
                  <Text weight="light">
                    Select a minimum of two people to create a group...
                  </Text>
                  <div className="flex flex-wrap gap-4 pl-2">
                    <Tooltip content="Click to remove">
                      <Button
                        variant="ghost"
                        className="flex gap-2 transition"
                        radius="medium">
                        <Avatar fallback="J" />
                        <Text weight="bold" className="uppercase">
                          Juan
                        </Text>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                <Button color="blue" size="3">
                  Create
                  <IconSend />
                </Button>
              </div>
            )}
            {dialogSelection === DialogSelectionEnum.JOIN_GROUP && (
              <div className="flex items-center gap-2">
                <TextField.Root
                  size="3"
                  variant="soft"
                  color="gray"
                  className="w-full">
                  <TextField.Input placeholder="Group code" />
                </TextField.Root>
                <Button color="blue">
                  <IconSend />
                </Button>
              </div>
            )}
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
