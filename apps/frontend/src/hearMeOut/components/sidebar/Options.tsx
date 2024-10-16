import { Button, Dialog, IconButton, Tooltip } from '@radix-ui/themes';
import {
  IconChevronLeft,
  IconPlus,
  IconUserPlus,
  IconUsers,
  IconUsersGroup,
  IconX
} from '@tabler/icons-react';
import { useState } from 'react';
import { AddContactOption } from '@hearmeout/components/sidebar/AddContactOption';
import { CreateGroupOption } from '@hearmeout/components/sidebar/CreateGroupOption';
import { JoinGroupOption } from '@hearmeout/components/sidebar/JoinGroupOption';

enum DialogSelectionEnum {
  ADD_CONTACT = 'ADD_CONTACT',
  CREATE_GROUP = 'CREATE_GROUP',
  JOIN_GROUP = 'JOIN_GROUP',
  NONE = 'NONE'
}

export const Options: React.FC = () => {
  const [dialogSelection, setDialogSelection] = useState<DialogSelectionEnum>(
    DialogSelectionEnum.NONE
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogSelection(DialogSelectionEnum.NONE);
  };

  const onResetDialog = () => {
    setDialogSelection(DialogSelectionEnum.NONE);
  };

  const onOpenDialog = (open: boolean) => {
    setIsDialogOpen(open);
    if (!isDialogOpen) {
      onResetDialog();
    }
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
    <Dialog.Root open={isDialogOpen} onOpenChange={onOpenDialog}>
      <Tooltip content="Create channel">
        <Dialog.Trigger>
          <IconButton className="bg-iris cursor-pointer" radius="large">
            <IconPlus />
          </IconButton>
        </Dialog.Trigger>
      </Tooltip>

      <Dialog.Content>
        <div className="flex items-center justify-between w-full mb-6 max-w-[532px]">
          {dialogSelection !== DialogSelectionEnum.NONE && (
            <Button
              variant="ghost"
              className="transition cursor-pointer"
              onClick={onResetDialog}>
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
              className="w-full cursor-pointer"
              onClick={onAddContactClick}>
              Add contact
              <IconUserPlus />
            </Button>
            <Button
              variant="soft"
              size="3"
              color="blue"
              className="w-full cursor-pointer"
              onClick={onCreateGroupClick}>
              Create group
              <IconUsersGroup />
            </Button>
            <Button
              variant="soft"
              size="3"
              color="ruby"
              className="w-full cursor-pointer"
              onClick={onJoinGroupClick}>
              Join group
              <IconUsers />
            </Button>
          </div>
        )}
        {dialogSelection === DialogSelectionEnum.ADD_CONTACT && (
          <AddContactOption />
        )}
        {dialogSelection === DialogSelectionEnum.CREATE_GROUP && (
          <CreateGroupOption closeDialog={closeDialog} />
        )}
        {dialogSelection === DialogSelectionEnum.JOIN_GROUP && (
          <JoinGroupOption closeDialog={closeDialog} />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};
