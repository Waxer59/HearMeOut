import {
  Avatar,
  Button,
  Dialog,
  DropdownMenu,
  IconButton,
  Text,
  Tooltip
} from '@radix-ui/themes';
import {
  IconBrightnessDown,
  IconBrush,
  IconCheck,
  IconLogout,
  IconMoon,
  IconSettings,
  IconUserCircle,
  IconUserPlus,
  IconX
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import {
  acceptFriendRequest,
  denyFriendRequest,
  getFriendRequests,
  signOut
} from '../../services/hearMeOutAPI';
import { useAccountStore } from '../../store/account';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';
import { useState } from 'react';
import { toast } from 'sonner';

export const SidebarProfile = () => {
  const { account, clearAccount } = useAccountStore((state) => state);
  const [friendRequests, setFriendRequests] = useState([]);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();

    navigate('/');
    clearAccount();
  };

  const handleFriendRequests = async () => {
    const { data } = await getFriendRequests();
    setFriendRequests(data);
  };

  const handleAcceptFriendRequest = async (id: string): Promise<void> => {
    await acceptFriendRequest(id);
    setFriendRequests(
      friendRequests.filter(({ id: reqId }: { id: string }) => reqId !== id)
    );
    toast.success('Friend request accepted!');
  };

  const handleDenyFriendRequest = async (id: string): Promise<void> => {
    await denyFriendRequest(id);
    setFriendRequests(
      friendRequests.filter(({ id: reqId }: { id: string }) => reqId !== id)
    );
    toast.success('Friend request denied!');
  };

  return (
    <div className="mt-auto pt-3 mb-4 flex items-center">
      <Text
        weight="bold"
        className="flex items-center justify-start gap-3 font-bold uppercase text-lg w-full transition">
        <Avatar
          radius="large"
          src={account?.avatar}
          fallback={getFallbackAvatarName(account!.username)}
        />
        {account!.username}
      </Text>

      <div className="flex gap-6">
        <Dialog.Root>
          <Tooltip content="Friend Requests">
            <Dialog.Trigger>
              <Button
                variant="ghost"
                className="transition"
                onClick={handleFriendRequests}>
                <IconUserPlus size={24} className="opacity-70" />
              </Button>
            </Dialog.Trigger>
          </Tooltip>
          <Dialog.Content>
            <Dialog.Title>Friend Requests</Dialog.Title>
            {friendRequests.length <= 0 && (
              <Dialog.Description>
                You have no friend requests at the moment.
              </Dialog.Description>
            )}
            <div className="flex flex-col gap-5 mt-5">
              {friendRequests.map(({ from, id }: any) => (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      radius="large"
                      fallback={getFallbackAvatarName(from.username)}
                      src={from.avatar}
                    />{' '}
                    <span className="font-bold uppercase">{from.username}</span>
                  </div>
                  <div className="flex gap-4">
                    <Tooltip content="Accept">
                      <IconButton
                        variant="ghost"
                        color="grass"
                        onClick={async () =>
                          await handleAcceptFriendRequest(id)
                        }>
                        <IconCheck size={24} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Deny">
                      <IconButton
                        variant="ghost"
                        color="red"
                        onClick={async () => await handleDenyFriendRequest(id)}>
                        <IconX size={24} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
        <DropdownMenu.Root>
          <Tooltip content="Settings">
            <DropdownMenu.Trigger>
              <Button variant="ghost" className="transition">
                <IconSettings size={24} className="opacity-70" />
              </Button>
            </DropdownMenu.Trigger>
          </Tooltip>
          <DropdownMenu.Content>
            <DropdownMenu.Item className="cursor-pointer flex justify-start gap-2">
              <IconUserCircle size={18} />
              Profile
            </DropdownMenu.Item>

            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="cursor-pointer flex justify-start gap-2">
                <IconBrush size={18} />
                Theme
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item className="flex items-center gap-2 cursor-pointer">
                  <IconMoon size={18} />
                  Dark
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center gap-2 cursor-pointer">
                  <IconBrightnessDown size={18} />
                  Light
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>

            <DropdownMenu.Separator />

            <DropdownMenu.Item
              color="red"
              className="cursor-pointer flex justify-start gap-2"
              onClick={handleSignOut}>
              <IconLogout size={18} />
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};
