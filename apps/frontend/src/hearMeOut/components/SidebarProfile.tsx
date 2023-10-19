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
  IconTrash,
  IconUserCircle,
  IconUserPlus,
  IconX
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../services/hearMeOutAPI';
import { useAccountStore } from '../../store/account';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';
import { toast } from 'sonner';
import * as Tabs from '@radix-ui/react-tabs';
import { useSocketChatEvents } from '../hooks/useSocketChatEvents';
import { useChatStore } from '../../store';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_ITEMS } from '../../types/types';

export const SidebarProfile = () => {
  const {
    account,
    clearAccount,
    friendRequests,
    removeFriendRequest,
    friendRequestsOutgoing,
    removeFriendRequestOutgoing
  } = useAccountStore((state) => state);
  const { clearChatState } = useChatStore((state) => state);
  const { sendAcceptFriendRequest, sendRemoveFriendRequest } =
    useSocketChatEvents();
  const { setLocalStorageItem } = useLocalStorage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();

    navigate(0);
    setLocalStorageItem(LOCAL_STORAGE_ITEMS.isAuth, false);
    clearAccount();
    clearChatState();
  };

  const handleAcceptFriendRequest = async (id: string): Promise<void> => {
    sendAcceptFriendRequest(id);
    removeFriendRequest(id);
    toast.success('Friend request accepted!');
  };

  const handleRemoveRequest = async (id: string): Promise<void> => {
    sendRemoveFriendRequest(id);
    removeFriendRequestOutgoing(id);
    toast.success('Friend request removed!');
  };

  const handleDenyFriendRequest = async (id: string): Promise<void> => {
    sendRemoveFriendRequest(id);
    removeFriendRequest(id);
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
              <Button variant="ghost" className="transition cursor-pointer">
                <IconUserPlus size={24} className="opacity-70" />
              </Button>
            </Dialog.Trigger>
          </Tooltip>
          <Dialog.Content>
            <Dialog.Title>Friend Requests</Dialog.Title>
            <div className="flex flex-col gap-5 mt-5">
              <Tabs.Root defaultValue="incoming">
                <Tabs.List className="flex justify-around mb-4">
                  <Tabs.Trigger
                    value="incoming"
                    className="data-[state=active]:opacity-70 transition uppercase font-bold flex flex-col gap-2 group">
                    Incoming
                    <div className="h-1 w-full bg-white rounded opacity-70 group-data-[state=inactive]:hidden"></div>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="outgoing"
                    className="data-[state=active]:opacity-70 transition uppercase font-bold flex flex-col gap-2 group">
                    Outgoing
                    <div className="h-1 w-full bg-white rounded opacity-70 group-data-[state=inactive]:hidden"></div>
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="incoming" className="h-full">
                  {friendRequests?.map(({ from, id }: any) => (
                    <div key={id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          radius="large"
                          fallback={getFallbackAvatarName(from.username)}
                          src={from.avatar}
                        />{' '}
                        <span className="font-bold uppercase">
                          {from.username}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <Tooltip content="Accept">
                          <IconButton
                            variant="ghost"
                            color="grass"
                            className="cursor-pointer"
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
                            className="cursor-pointer"
                            onClick={async () =>
                              await handleDenyFriendRequest(id)
                            }>
                            <IconX size={24} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </Tabs.Content>
                <Tabs.Content value="outgoing" className="h-full">
                  {friendRequestsOutgoing?.map(({ to, id }: any) => (
                    <div key={id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          radius="large"
                          fallback={getFallbackAvatarName(to.username)}
                          src={to.avatar}
                        />{' '}
                        <span className="font-bold uppercase">
                          {to.username}
                        </span>
                      </div>
                      <Tooltip content="Remove request">
                        <IconButton
                          variant="ghost"
                          className="transition cursor-pointer"
                          color="red"
                          onClick={async () => await handleRemoveRequest(id)}>
                          <IconTrash size={24} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ))}
                </Tabs.Content>
              </Tabs.Root>
            </div>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
        <DropdownMenu.Root>
          <Tooltip content="Settings">
            <DropdownMenu.Trigger>
              <Button variant="ghost" className="transition cursor-pointer">
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
