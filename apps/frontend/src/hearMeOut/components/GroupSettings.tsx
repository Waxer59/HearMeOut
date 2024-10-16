import {
  Avatar,
  Button,
  Heading,
  Badge,
  ContextMenu,
  Dialog,
  Checkbox,
  Tooltip,
  TextField
} from '@radix-ui/themes';
import {
  IconCrown,
  IconCrownOff,
  IconDoorExit,
  IconRefresh,
  IconUserMinus,
  IconUsersPlus,
  IconX,
  IconTrash
} from '@tabler/icons-react';
import { ConversationTypes } from '@store/types/types';
import { useRef, useState } from 'react';
import { ImageUploaderBtn } from '@components/ImageUploaderBtn';
import { useSocketChatEvents } from '@hearmeout/hooks/useSocketChatEvents';
import type { InputEvent } from '@/types/types';
import { toast } from 'sonner';
import { ACCEPTED_IMG_EXTENSIONS } from '@constants';
import { EditableTitle } from '@components/EditableTitle';
import { useAccountStore } from '@store/account';
import { useChatStore } from '@store/chat';
import { useUiStore } from '@store/ui';
import { getBase64File } from '@hearmeout/helpers/getBase64File';
import { getFallbackAvatarName } from '@hearmeout/helpers/getFallbackAvatarName';
import { getFileExtension } from '@hearmeout/helpers/getFileExtension';
import { useConversation } from '@hearmeout/hooks/useConversation';

export const GroupSettings = () => {
  const [newUserSearch, setNewUserSearch] = useState('');
  const [isNewUsersDialogOpen, setIsNewUsersDialogOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const newUsers = useRef<string[]>([]);
  const { sendUpdateGroup, sendExitGroup, sendRemoveConversation } =
    useSocketChatEvents();
  const setShowGroupSettings = useUiStore(
    (state) => state.setShowGroupSettings
  );
  const showGroupSettings = useUiStore((state) => state.showGroupSettings);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  )!;
  const { id: ownUserId } = useAccountStore((state) => state.account)!;
  const { conversation } = useConversation(currentConversationId);
  const { name, icon, users, adminIds, type, joinCode } = conversation;
  const usersNotInGroup = useChatStore((state) => state.conversations).filter(
    (el) => {
      const userInChat = el.users.find((user) => user.id !== ownUserId)!;
      const isUserInGroup = users.find((user) => user.id === userInChat?.id);
      return !isUserInGroup && el.type === ConversationTypes.chat;
    }
  );
  const isAdminAccount = adminIds.includes(ownUserId);

  const handleAddNewUsers = () => {
    sendUpdateGroup(currentConversationId, {
      addUsers: newUsers.current
    });
    newUsers.current = [];
    setIsNewUsersDialogOpen(false);
  };

  const handleAddUserCheckbox = (isChecked: boolean, userId: string): void => {
    if (isChecked) {
      newUsers.current.push(userId);
    } else {
      newUsers.current = newUsers.current.filter((user) => user !== userId);
    }
  };

  const handleChangeGroupName = (title: string): void => {
    sendUpdateGroup(currentConversationId, {
      name: title
    });
  };

  const handleMakeAdmin = (userId: string): void => {
    sendUpdateGroup(currentConversationId, {
      makeAdmins: [userId]
    });
  };

  const handleRemoveAdmin = (userId: string): void => {
    sendUpdateGroup(currentConversationId, {
      removeAdmins: [userId]
    });
  };

  const handleKickUser = (userId: string): void => {
    sendUpdateGroup(currentConversationId, {
      kickUsers: [userId]
    });
  };

  const handleDeleteGroup = (): void => {
    sendRemoveConversation(currentConversationId);
  };

  const handleChangeImage = async (e: InputEvent) => {
    const file = e.target.files?.[0];
    const fileExt = getFileExtension(file!.name);
    if (!file) {
      toast.error('There was an error uploading your avatar');
      return;
    }

    if (!ACCEPTED_IMG_EXTENSIONS.includes(fileExt)) {
      toast.error('Invalid file extension');
      return;
    }

    const base64File = await getBase64File(file);
    sendUpdateGroup(currentConversationId, {
      icon: base64File
    });
  };

  const handleLeaveGroup = () => {
    sendExitGroup(currentConversationId);
    setShowGroupSettings(false);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleNewJoinId = (joinCode = true) => {
    sendUpdateGroup(currentConversationId, {
      joinCode
    });
  };

  const handleClose = () => {
    setShowGroupSettings(false);
  };

  if (type !== ConversationTypes.group) {
    return null;
  }
  return (
    <aside
      className={`bg-secondary w-80 rounded-tl-3xl rounded-bl-3xl overflow-auto absolute right-0 h-full ease-in-out duration-300 ${
        showGroupSettings ? 'translate-x-0' : 'translate-x-full'
      }`}
      ref={asideRef}>
      <Button
        variant="ghost"
        color="red"
        className="cursor-pointer transition block mt-6 ml-6"
        onClick={handleClose}>
        <IconX />
      </Button>
      <div className="flex flex-col items-center gap-5 mt-5 w-full">
        {isAdminAccount ? (
          <>
            <ImageUploaderBtn
              handleChangeImage={handleChangeImage}
              imageURL={icon}
              size="9"
              title={name}
            />
            <EditableTitle
              as="h3"
              title={name}
              onChangeTitle={handleChangeGroupName}
              dialogTitle="Change group name"
            />
            {!joinCode && (
              <Button
                variant="soft"
                className="cursor-pointer"
                onClick={() => handleNewJoinId()}>
                Create Join Code
              </Button>
            )}
          </>
        ) : (
          <>
            <Avatar
              fallback={getFallbackAvatarName(name)}
              src={icon}
              size="9"
            />
            <Heading
              as="h3"
              className="mx-auto max-w-[10ch] capitalize text-center">
              {name}
            </Heading>
          </>
        )}
        {joinCode && (
          <div className="flex items-center gap-4">
            <Tooltip content="Click to copy!">
              <Button
                className="cursor-pointer transition-[background]"
                variant="ghost"
                onClick={() => handleCopyToClipboard(joinCode)}>
                {joinCode}
              </Button>
            </Tooltip>
            {isAdminAccount && (
              <>
                <Tooltip content="Refresh join id">
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    onClick={() => handleNewJoinId()}>
                    <IconRefresh />
                  </Button>
                </Tooltip>
                <Tooltip content="Delete join id">
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    color="red"
                    onClick={() => handleNewJoinId(false)}>
                    <IconTrash />
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        )}
      </div>
      <ul className="mt-7 px-5 max-h-96 overflow-auto">
        {users.map(({ username, id, avatar }) => (
          <UserItem
            key={id}
            username={username}
            id={id}
            avatar={avatar}
            isUserAdmin={adminIds.includes(id)}
            isAdminAccount={isAdminAccount}
            onKickUser={() => handleKickUser(id)}
            onMakeAdmin={() => handleMakeAdmin(id)}
            onRemoveAdmin={() => handleRemoveAdmin(id)}
            showControls={ownUserId !== id}
          />
        ))}
      </ul>
      <div className="flex flex-col gap-5 mt-8 items-center">
        <Button
          className="transition-[background] cursor-pointer uppercase font-bold w-3/4"
          color="ruby"
          variant="soft"
          onClick={handleLeaveGroup}>
          leave group
          <IconDoorExit size={18} />
        </Button>
        {isAdminAccount && (
          <>
            <Dialog.Root
              onOpenChange={setIsNewUsersDialogOpen}
              open={isNewUsersDialogOpen}>
              <Dialog.Trigger>
                <Button
                  className="transition-[background] cursor-pointer uppercase font-bold w-3/4"
                  variant="ghost"
                  color="iris">
                  Add users
                  <IconUsersPlus size={18} />
                </Button>
              </Dialog.Trigger>
              <Dialog.Content className="w-80">
                <Dialog.Title>Add users to group</Dialog.Title>
                <div className="flex flex-col gap-6 max-h-52 overflow-auto mt-10 items-center">
                  {usersNotInGroup.length === 0 ? (
                    <Heading as="h3" className="text-xl">
                      There are no users to add to the group
                    </Heading>
                  ) : (
                    <TextField.Root className="w-full">
                      <TextField.Input
                        placeholder="Search for a user"
                        onChange={(ev) => setNewUserSearch(ev.target.value)}
                      />
                    </TextField.Root>
                  )}
                  {usersNotInGroup
                    .filter(({ users }) => {
                      const userInChat = users.find(
                        (user) => user.id !== ownUserId
                      )!;

                      return (
                        userInChat?.username
                          .toLowerCase()
                          .includes(newUserSearch) && newUserSearch.length >= 0
                      );
                    })
                    .map(({ id, users }) => {
                      const userInChat = users.find(
                        (user) => user.id !== ownUserId
                      )!;

                      return (
                        <div
                          className="flex justify-between gap-5 items-center w-full"
                          key={id}>
                          <div className="flex gap-5 items-center">
                            <Avatar
                              fallback={getFallbackAvatarName(
                                userInChat?.username
                              )}
                              src={userInChat?.avatar}
                              size="4"
                            />
                            <Heading as="h3" className="capitalize text-md">
                              {userInChat?.username}
                            </Heading>
                          </div>
                          <Checkbox
                            color="blue"
                            variant="surface"
                            size="3"
                            onCheckedChange={(check) =>
                              handleAddUserCheckbox(
                                check as boolean,
                                userInChat?.id
                              )
                            }
                          />
                        </div>
                      );
                    })}
                </div>
                {usersNotInGroup.length > 0 && (
                  <Button
                    className="mt-10 w-full cursor-pointer"
                    variant="soft"
                    color="iris"
                    onClick={handleAddNewUsers}>
                    <IconUsersPlus />
                    Add users
                  </Button>
                )}
              </Dialog.Content>
            </Dialog.Root>
            <Button
              className="transition-[background] cursor-pointer uppercase font-bold w-3/4 mt-10"
              color="red"
              variant="soft"
              onClick={handleDeleteGroup}>
              delete group
              <IconTrash size={18} />
            </Button>
          </>
        )}
      </div>
    </aside>
  );
};

interface UserItemProps {
  id: string;
  username: string;
  avatar?: string;
  isUserAdmin: boolean;
  isAdminAccount?: boolean;
  showControls?: boolean;
  onKickUser?: () => void;
  onMakeAdmin?: () => void;
  onRemoveAdmin?: () => void;
}

const UserItem: React.FC<UserItemProps> = ({
  id,
  username,
  isUserAdmin,
  avatar,
  onKickUser,
  isAdminAccount,
  onMakeAdmin,
  onRemoveAdmin,
  showControls = true
}) => (
  <ContextMenu.Root>
    <ContextMenu.Trigger>
      <li
        className="flex items-center justify-between hover:bg-primary p-2 rounded transition-[background] duration-300 cursor-pointer"
        key={id}>
        <div className="flex gap-2 items-center">
          <Avatar
            fallback={getFallbackAvatarName(username)}
            src={avatar}
            size="4"
          />
          <span className="uppercase font-bold truncate max-w-[16ch]">
            {username}
          </span>
        </div>
        <Badge className="uppercase" color={isUserAdmin ? 'green' : 'gray'}>
          {isUserAdmin ? 'admin' : 'member'}
        </Badge>
      </li>
    </ContextMenu.Trigger>
    {isAdminAccount && showControls && (
      <ContextMenu.Content>
        {!isUserAdmin ? (
          <ContextMenu.Item color="gold" onClick={onMakeAdmin}>
            <span className="flex gap-2">
              <IconCrown size={18} /> Admin
            </span>
          </ContextMenu.Item>
        ) : (
          <>
            <ContextMenu.Item color="red" onClick={onRemoveAdmin}>
              <span className="flex gap-2">
                <IconCrownOff size={18} /> Remove admin
              </span>
            </ContextMenu.Item>
          </>
        )}

        <ContextMenu.Item color="red" onClick={onKickUser}>
          <span className="flex gap-2">
            <IconUserMinus size={18} /> Kick
          </span>
        </ContextMenu.Item>
      </ContextMenu.Content>
    )}
  </ContextMenu.Root>
);
