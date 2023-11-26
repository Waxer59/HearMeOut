import { Avatar, Button, Heading, Badge, ContextMenu } from '@radix-ui/themes';
import {
  IconDoorExit,
  IconTrash,
  IconUserMinus,
  IconX
} from '@tabler/icons-react';
import { useAccountStore, useChatStore } from '../../store';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';
import { ConversationTypes } from '../../store/types/types';
import { useRef } from 'react';
import { ImageUploaderBtn } from '../../components/ImageUploaderBtn';
import { EditableTitle } from '../../components';

export const GroupSettings = () => {
  const setShowGroupSettings = useChatStore(
    (state) => state.setShowGroupSettings
  );
  const showGroupSettings = useChatStore((state) => state.showGroupSettings);
  const { id, username, avatar } = useAccountStore((state) => state.account)!;
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const { name, icon, users, adminIds, type } = useChatStore((state) =>
    state.conversations.find((c) => c.id === currentConversationId)
  )!;
  const asideRef = useRef<HTMLElement>(null);
  const isAdminAccount = adminIds.includes(id);

  const handleChangeGroupName = () => {};

  const handleKickUser = () => {};

  const handleChangeImage = () => {};

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
          />
        ) : (
          <Heading as="h3" className="mx-auto max-w-[10ch] capitalize">
            {name}
          </Heading>
        )}
      </div>
      <ul className="mt-7 px-5 max-h-96 overflow-auto">
        {users.map(({ username, id, avatar }) => (
          <UserItem
            username={username}
            id={id}
            avatar={avatar}
            isUserAdmin={adminIds.includes(id)}
            isAdminAccount={isAdminAccount}
            onKickUser={handleKickUser}
            key={id}
          />
        ))}
        <UserItem
          username={username}
          id={id}
          avatar={avatar}
          isUserAdmin={isAdminAccount}
          showControls={false}
        />
      </ul>
      <div className="flex flex-col gap-5 mt-8 items-center">
        <Button
          className="transition-[background] cursor-pointer"
          color="red"
          variant="ghost">
          <span className="uppercase font-bold">leave group</span>
          <IconDoorExit />
        </Button>
        {isAdminAccount && (
          <Button
            className="transition-[background] cursor-pointer"
            color="red"
            variant="solid">
            <span className="uppercase font-bold">delete group</span>
            <IconTrash />
          </Button>
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
}

const UserItem: React.FC<UserItemProps> = ({
  id,
  username,
  isUserAdmin,
  avatar,
  onKickUser,
  isAdminAccount,
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
        <ContextMenu.Item
          color="red"
          className="flex gap-2"
          onClick={onKickUser}>
          <IconUserMinus size={18} /> Kick
        </ContextMenu.Item>
      </ContextMenu.Content>
    )}
  </ContextMenu.Root>
);
