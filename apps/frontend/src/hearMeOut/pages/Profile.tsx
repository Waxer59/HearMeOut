import {
  AlertDialog,
  Avatar,
  Button,
  Dialog,
  Heading,
  IconButton,
  TextFieldInput,
  Tooltip
} from '@radix-ui/themes';
import { IconChevronLeft, IconPencil, IconTrash } from '@tabler/icons-react';
import { useAccountStore } from '../../store';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { FurtherProfileUpdates } from '../components';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  deleteUserAccount,
  updateUserAccount,
  updateUserAvatar
} from '../../services/hearMeOutAPI';
import { HttpStatusCodes, LOCAL_STORAGE_ITEMS } from '../../types/types';
import { getFileExtension } from '../../helpers/getFileExtension';
import { ACCEPTED_IMG_EXTENSIONS } from '../../constants/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Profile: React.FC = () => {
  const account = useAccountStore((state) => state.account);
  const updateAccount = useAccountStore((state) => state.updateAccount);
  const fileInput = useRef<HTMLInputElement>(null);
  const { setLocalStorageItem } = useLocalStorage();
  const [newUsername, setNewUsername] = useState('');
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const { username, avatar, isGithubAccount } = account!;

  useEffect(() => {
    document.title = 'Profile | HearMeOut';
  }, []);

  const handleChangeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
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

    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await updateUserAvatar(file);
    if (data.status >= HttpStatusCodes.BAD_REQUEST) {
      toast.error('There was an error uploading your avatar');
    } else {
      toast.success('Avatar uploaded successfully');
      console.log(data);
      updateAccount({ avatar: data.avatar });
    }
  };

  const handleDeleteAccount = async () => {
    const { data } = await deleteUserAccount();
    if (data.status >= HttpStatusCodes.BAD_REQUEST) {
      toast.error('There was an error deleting your account');
    } else {
      toast.success('Account deleted successfully');
      setLocalStorageItem(LOCAL_STORAGE_ITEMS.isAuth, false);
      window.location.reload();
    }
  };

  const handleChangeUsername = async () => {
    if (newUsername.length < 3) {
      toast.error('The Username is too short');
      return;
    }

    if (newUsername.length > 39) {
      toast.error('The Username is too long');
      return;
    }

    setNewUsername('');
    const data = await updateUserAccount({ username: newUsername });
    setIsNewUserModalOpen(false);

    if (data.status >= HttpStatusCodes.BAD_REQUEST) {
      toast.error('There was an error changing your username');
    } else {
      toast.success('Username changed successfully');
      updateAccount({ username: newUsername });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-24 mt-24 p-7 rounded-lg h-auto border border-gray-400 justify-center w-11/12 max-w-[650px] mx-auto bg-secondary">
        <div className="flex flex-col gap-7 items-center w-full relative">
          <div className="absolute top-0 left-0">
            <Button variant="ghost" className="transition" asChild>
              <Link to="/chat">
                <IconChevronLeft /> Go back
              </Link>
            </Button>
          </div>
          <Tooltip content="Change avatar">
            <button onClick={() => fileInput.current?.click()}>
              <Avatar
                fallback={getFallbackAvatarName(username)}
                src={avatar}
                width="40px"
                size="9"
              />
            </button>
          </Tooltip>
          <div className="flex items-center gap-4 justify-center w-full">
            <Heading as="h2" size="8" className="capitalize max-w-[10ch]">
              {username}
            </Heading>
            <Dialog.Root
              onOpenChange={(o) => setIsNewUserModalOpen(o)}
              open={isNewUserModalOpen}>
              <Dialog.Trigger>
                <IconButton className="transition">
                  <IconPencil className="text-tertiary" />
                </IconButton>
              </Dialog.Trigger>
              <Dialog.Content className="max-w-md">
                <Dialog.Title>Change username</Dialog.Title>

                <div className="flex flex-col gap-4">
                  <TextFieldInput
                    placeholder={username}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <Dialog.Close>
                      <Button variant="soft" color="red">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button
                        onClick={handleChangeUsername}
                        className="text-tertiary">
                        Save
                      </Button>
                    </Dialog.Close>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        </div>
        {!isGithubAccount && <FurtherProfileUpdates />}
        <div className="flex justify-center">
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button variant="soft" color="red" size="3">
                <IconTrash /> Delete account
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content className="max-w-md">
              <AlertDialog.Title>Delete account</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Are you sure? This action cannot be undone.
              </AlertDialog.Description>

              <div className="flex justify-end mt-5">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    variant="soft"
                    color="red"
                    onClick={handleDeleteAccount}>
                    Delete account
                  </Button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        ref={fileInput}
        accept="image/*"
        onChange={handleChangeAvatar}
      />
      <Toaster position="bottom-right" />
    </>
  );
};
