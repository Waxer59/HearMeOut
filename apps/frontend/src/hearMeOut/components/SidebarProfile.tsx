import { Avatar, Button, DropdownMenu, Text, Tooltip } from '@radix-ui/themes';
import {
  IconBrightnessDown,
  IconBrush,
  IconLogout,
  IconMoon,
  IconSettings,
  IconUserCircle
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../services/hearMeOutAPI';
import { useAccountStore } from '../../store/account';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';

export const SidebarProfile = () => {
  const { account, clearAccount } = useAccountStore((state) => state);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();

    navigate('/');
    clearAccount();
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
  );
};
