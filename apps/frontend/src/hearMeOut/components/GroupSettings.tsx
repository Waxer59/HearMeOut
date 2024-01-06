import {
  Avatar,
  Button,
  Heading,
  Badge,
  ContextMenu,
  Dialog,
  Checkbox
} from '@radix-ui/themes';
import {
  IconCrown,
  IconCrownOff,
  IconDoorExit,
  IconTrash,
  IconUserMinus,
  IconUsersPlus,
  IconX
} from '@tabler/icons-react';
import { useAccountStore, useChatStore } from '../../store';
import {
  getFallbackAvatarName,
  getBase64File,
  getFileExtension
} from '../helpers';
import { ConversationTypes } from '../../store/types/types';
import { useRef, useState } from 'react';
import { ImageUploaderBtn } from '../../components/ImageUploaderBtn';
import { EditableTitle } from '../../components';
import { useSocketChatEvents } from '../hooks/useSocketChatEvents';
import type { InputEvent } from '../../types/types';
import { toast } from 'sonner';
import { ACCEPTED_IMG_EXTENSIONS } from '../../constants/constants';

export const GroupSettings = () => {
  const setShowGroupSettings = useChatStore(
    (state) => state.setShowGroupSettings
  );
  const showGroupSettings = useChatStore((state) => state.showGroupSettings);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  )!;
  const setCurrentConversationId = useChatStore(
    (state) => state.setCurrentConversationId
  );
  const { id: ownUserId } = useAccountStore((state) => state.account)!;
  const removeConversation = useChatStore((state) => state.removeConversation);
  const asideRef = useRef<HTMLElement>(null);
  const newUsers = useRef<string[]>([]);
  const [isNewUsersDialogOpen, setIsNewUsersDialogOpen] = useState(false);
  const { name, icon, users, adminIds, type } = useChatStore((state) =>
    state.conversations.find((c) => c.id === currentConversationId)
  )!;
  const usersNotInGroup = useChatStore((state) =>
    state.conversations.filter((el) => el.type === ConversationTypes.chat)
  ).filter((el) => {
    const userInChat = el.users.find((user) => user.id !== ownUserId)!;
    const isUserInGroup = users.find((user) => user.id === userInChat.id);
    return !isUserInGroup;
  });
  const { sendUpdateGroup, sendExitGroup, sendRemoveConversation } =
    useSocketChatEvents();
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
    setCurrentConversationId(null);
    setShowGroupSettings(false);
    removeConversation(currentConversationId);
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
          <ImageUploaderBtn
            handleChangeImage={handleChangeImage}
            imageURL={icon}
            size="9"
            title={name}
          />
        ) : (
          <Avatar fallback={getFallbackAvatarName(name)} src={icon} size="9" />
        )}
        {isAdminAccount ? (
          <EditableTitle
            as="h3"
            title={name}
            onChangeTitle={handleChangeGroupName}
            dialogTitle="Change group name"
          />
        ) : (
          <Heading
            as="h3"
            className="mx-auto max-w-[10ch] capitalize text-center">
            {name}
          </Heading>
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
              <Dialog.Content>
                <Dialog.Title>Add users to group</Dialog.Title>
                <div className="flex flex-col gap-6 mt-10 items-center">
                  {usersNotInGroup.length === 0 && (
                    <Heading as="h3">
                      There are no users to add to the group
                    </Heading>
                  )}
                  {usersNotInGroup.map(({ id, users }) => {
                    const userInChat = users.find(
                      (user) => user.id !== ownUserId
                    )!;

                    return (
                      <div className="flex items-center w-full gap-5" key={id}>
                        <Avatar
                          fallback={getFallbackAvatarName(userInChat.username)}
                          src={userInChat.avatar}
                          size="4"
                        />
                        <div className="flex gap-4 items-center">
                          <Heading as="h3" className="capitalize text-md">
                            {userInChat.username}
                          </Heading>
                          <Checkbox
                            color="blue"
                            variant="surface"
                            size="3"
                            onCheckedChange={(check) =>
                              handleAddUserCheckbox(
                                check as boolean,
                                userInChat.id
                              )
                            }
                          />
                        </div>
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
