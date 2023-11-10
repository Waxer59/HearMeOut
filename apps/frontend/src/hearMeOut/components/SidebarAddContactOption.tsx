import { Avatar, TextField, Button } from '@radix-ui/themes';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { DEBOUNCE_SEARCH_TIME } from '../../constants/constants';
import { searchUser } from '../../services/hearMeOutAPI';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';
import { HttpStatusCodes } from '../../types/types';
import { toast } from 'sonner';
import { useSocketChatEvents } from '../hooks/useSocketChatEvents';
import type { AccountDetails } from '../../store/types/types';

interface PropsUserBtn {
  id: string;
  username: string;
  avatar?: string;
}

const UserBtn: React.FC<PropsUserBtn> = ({ id, username, avatar }) => {
  const { sendFriendRequest } = useSocketChatEvents();

  const handleAddFriend = () => {
    sendFriendRequest(id);
    toast.success('Friend request sent!');
  };

  return (
    <Button
      className="flex items-center gap-3 cursor-pointer"
      variant="ghost"
      onClick={handleAddFriend}>
      <Avatar
        radius="large"
        fallback={getFallbackAvatarName(username)}
        src={avatar}
      />{' '}
      <span className="font-bold uppercase">{username}</span>
    </Button>
  );
};

export function SidebarAddContactOption() {
  const [query, setQuery] = useState('');
  const [usersFound, setUsersFound] = useState<AccountDetails[] | null>(null);
  const [value] = useDebounce(query, DEBOUNCE_SEARCH_TIME);

  useEffect(() => {
    async function search() {
      const users = await searchUsername(value);
      setUsersFound(users);
    }

    if (value.trim()) {
      search();
    }
  }, [value]);

  const searchUsername = async (name: string): Promise<AccountDetails[]> => {
    const { data, status } = await searchUser(name);
    if (status >= HttpStatusCodes.BAD_REQUEST) {
      return [];
    }
    return data;
  };

  return (
    <>
      <TextField.Root size="3" variant="soft" color="gray">
        <TextField.Slot>
          <IconSearch size={16} />
        </TextField.Slot>
        <TextField.Input
          placeholder="Contact username"
          onChange={(e) => setQuery(e.target.value)}
        />
      </TextField.Root>
      <div className="pt-4 pl-2 pb-2 w-full flex overflow-auto gap-4 overflow-y-hidden">
        {usersFound !== null &&
          usersFound.map((user) => <UserBtn key={user.id} {...user} />)}
      </div>
    </>
  );
}
