import { AlertDialog, Button } from '@radix-ui/themes';
import { IconChevronLeft, IconTrash } from '@tabler/icons-react';
import { useAccountStore } from '../../store';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { FurtherProfileUpdates } from '../components';
import { useEffect, type ChangeEvent } from 'react';
import {
  deleteUserAccount,
  updateUserAccount,
  updateUserAvatar
} from '../../services/hearMeOutAPI';
import { HttpStatusCodes, LOCAL_STORAGE_ITEMS } from '../../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getFileExtension } from '../../helpers/getFileExtension';
import { ACCEPTED_IMG_EXTENSIONS } from '../../constants/constants';
import { ImageUploaderBtn, EditableTitle } from '../../components';

export const Profile: React.FC = () => {
  const account = useAccountStore((state) => state.account);
  const updateAccount = useAccountStore((state) => state.updateAccount);
  const { setLocalStorageItem } = useLocalStorage();
  const { username, avatar, isGithubAccount } = account!;

  useEffect(() => {
    document.title = 'Profile | HearMeOut';
  }, []);

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

  const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
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
      updateAccount({ avatar: data.avatar });
    }
  };

  const handleChangeUsername = async (newUsername: string) => {
    if (newUsername.length < 3) {
      toast.error('The Username is too short');
      return;
    }

    if (newUsername.length > 39) {
      toast.error('The Username is too long');
      return;
    }

    const data = await updateUserAccount({ username: newUsername });

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
          <ImageUploaderBtn
            imageURL={avatar}
            handleChangeImage={handleChangeImage}
            title={username}
            size="9"
          />
          <EditableTitle
            as="h2"
            size="8"
            onChangeTitle={handleChangeUsername}
            title={username}
          />
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
      <Toaster position="bottom-right" />
    </>
  );
};
