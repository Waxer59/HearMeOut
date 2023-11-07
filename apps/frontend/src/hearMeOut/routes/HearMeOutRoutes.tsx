import { Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Chat from '../pages/Chat';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import { useEffect } from 'react';
import { verify } from '../../services/hearMeOutAPI';
import { useAccountStore, useChatStore } from '../../store';
import { LOCAL_STORAGE_ITEMS, type VerifyResponse } from '../../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const HearMeOutRoutes = () => {
  const { setAccount, setFriendRequests, setFriendRequestsOutgoing } =
    useAccountStore((state) => state);
  const { setConversations, setActiveConversations, setCurrentConversationId } =
    useChatStore((state) => state);
  const { setLocalStorageItem } = useLocalStorage();

  useEffect(() => {
    async function handleVerify() {
      const { data }: { data: VerifyResponse } = await verify();

      if (!data) {
        return;
      }

      setLocalStorageItem(LOCAL_STORAGE_ITEMS.isAuth, true);

      const {
        conversations,
        activeConversationIds,
        friendReqTos,
        friendReqFroms,
        ...account
      } = data;

      setCurrentConversationId(
        conversations.filter((el) => activeConversationIds.includes(el.id))?.[0]
          ?.id ?? null
      );
      setActiveConversations(activeConversationIds);
      setConversations(conversations);
      setFriendRequestsOutgoing(friendReqFroms);

      setAccount(account);
      setFriendRequests(friendReqTos);
    }

    function handleStorage(e: StorageEvent) {
      if (e.key === LOCAL_STORAGE_ITEMS.isAuth) {
        window.location.reload();
      }
    }

    handleVerify();
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoutes>
            <SignIn />
          </PublicRoutes>
        }
      />
      <Route
        path="/sign-up"
        element={
          <PublicRoutes>
            <SignUp />
          </PublicRoutes>
        }
      />

      <Route
        path="/chat"
        element={
          <PrivateRoutes>
            <Chat />
          </PrivateRoutes>
        }
      />
    </Routes>
  );
};

export default HearMeOutRoutes;
