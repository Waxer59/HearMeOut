import {
  Avatar,
  Button,
  Heading,
  Select,
  Text,
  TextField,
  Tooltip
} from '@radix-ui/themes';
import { IconSend } from '@tabler/icons-react';
import { useAccountStore, useChatStore } from '../../../store';
import {
  ConversationTypes,
  type AccountDetails
} from '../../../store/types/types';
import { useState } from 'react';
import { getFallbackAvatarName } from '../../helpers';
import { toast } from 'sonner';
import { useSocketChatEvents } from '../../hooks/useSocketChatEvents';

interface Props {
  closeDialog: () => void;
}

export const CreateGroupOption: React.FC<Props> = ({ closeDialog }) => {
  const [groupName, setGroupName] = useState('');
  const { conversations } = useChatStore();
  const [selectedUsers, setSelectedUsers] = useState<AccountDetails[]>([]);
  const { sendCreateGroup } = useSocketChatEvents();
  const ownUserId = useAccountStore((state) => state.account)!.id;

  const chatConversations = conversations.filter(
    (el) => el.type === ConversationTypes.chat
  );

  const addUser = (user: AccountDetails) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleCreateGroup = () => {
    if (selectedUsers.length < 2) {
      toast.error('Select a minimum of two people to create a group...');
      return;
    }

    if (groupName.trim().length < 3) {
      toast.error('Group name is required');
      return;
    }

    sendCreateGroup(
      groupName,
      selectedUsers.map((el) => el.id)
    );
    toast.success('Group created successfully!');
    closeDialog();
  };

  const removeUser = (user: AccountDetails) => {
    const newUsers = selectedUsers.filter((el) => el.id !== user.id);
    setSelectedUsers(newUsers);
  };

  const handleValueChange = (userId: string) => {
    const user = chatConversations
      .find((el) => {
        const userInChat = el.users.find((user) => user.id !== ownUserId)!;
        return userInChat.id === userId;
      })
      ?.users.find((user) => user.id !== ownUserId);
    if (!user) {
      toast.error('User not found');
      return;
    }
    addUser(user);
  };

  return (
    <div className="flex flex-col gap-8">
      <TextField.Root size="3" variant="soft" color="gray">
        <TextField.Input
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </TextField.Root>
      <div className="w-full flex flex-col gap-3">
        <Heading as="h3" size="3">
          Add users to group
        </Heading>
        <Select.Root onValueChange={handleValueChange}>
          <Select.Trigger placeholder="Contacts" />
          <Select.Content color="blue">
            {chatConversations
              .filter((el) => {
                const userInChat = el.users.find(
                  (user) => user.id !== ownUserId
                )!;
                const isUserSelected = selectedUsers.find(
                  (user) => user.id === userInChat.id
                );
                return !isUserSelected;
              })
              .map((el) => {
                const userInChat = el.users.find(
                  (user) => user.id !== ownUserId
                )!;
                return (
                  <Select.Item
                    key={el.id}
                    value={userInChat.id}
                    className="capitalize">
                    {userInChat.username}
                  </Select.Item>
                );
              })}
          </Select.Content>
        </Select.Root>
      </div>
      <div className="w-full flex flex-col gap-3">
        <Heading as="h3" size="3">
          Selected contacts
        </Heading>
        {selectedUsers.length <= 0 && (
          <Text weight="light">
            Select a minimum of two people to create a group...
          </Text>
        )}
        <div className="flex flex-wrap gap-4 pl-2">
          {selectedUsers.map((el) => (
            <Tooltip content="Click to remove" key={el.id}>
              <Button
                variant="ghost"
                className="flex gap-2 transition cursor-pointer"
                radius="medium"
                onClick={() => {
                  removeUser(el);
                }}>
                <Avatar
                  fallback={getFallbackAvatarName(el.username)}
                  src={el.avatar}
                />
                <Text weight="bold" className="uppercase">
                  {el.username}
                </Text>
              </Button>
            </Tooltip>
          ))}
        </div>
      </div>
      <Button
        color="blue"
        size="3"
        className="cursor-pointer"
        onClick={handleCreateGroup}>
        Create
        <IconSend />
      </Button>
    </div>
  );
};
