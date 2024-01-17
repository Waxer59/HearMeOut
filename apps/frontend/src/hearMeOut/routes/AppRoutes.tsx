import { Route, Routes } from 'react-router-dom';
import { SignUp, SignIn } from '../pages';
import { PrivateRoutes, PublicRoutes } from '../../router';
import { useAccountStore, useChatStore } from '../../store';
import { LOCAL_STORAGE_ITEMS, type VerifyResponse } from '../../types/types';
import { verify } from '../../services/hearMeOutAPI';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { ChatRoutes } from './ChatRoutes';

const AppRoutes = () => {
  const {
    setAccount,
    setFriendRequests,
    setFriendRequestsOutgoing,
    setSettings
  } = useAccountStore((state) => state);
  const { setConversations, setActiveConversations, setCurrentConversationId } =
    useChatStore((state) => state);
  const { setLocalStorageItem } = useLocalStorage();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useAccountStore((state) => state.isAuthenticated);

  useEffect(() => {
    async function handleVerify() {
      const { data }: { data: VerifyResponse } = await verify();

      if (!data) {
        setIsLoading(false);
        return;
      }

      setLocalStorageItem(LOCAL_STORAGE_ITEMS.isAuth, true);

      const { conversations, friendReqTos, friendReqFroms, ...account } = data;

      setCurrentConversationId(
        conversations.filter((el) =>
          account.activeConversationIds.includes(el.id)
        )?.[0]?.id ?? null
      );
      setActiveConversations(account.activeConversationIds);
      setConversations(conversations);
      setFriendRequestsOutgoing(friendReqFroms);

      if (account.configuration) {
        setSettings(account.configuration);
      }

      setAccount(account);
      setFriendRequests(friendReqTos);
      setIsLoading(false);
    }

    function handleStorage(e: StorageEvent) {
      if (e.key === LOCAL_STORAGE_ITEMS.isAuth) {
        window.location.reload();
      }
    }

    if (!isAuthenticated) {
      handleVerify();
    }

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#c5c5c5" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/*"
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
        path="/chat/*"
        element={
          <PrivateRoutes>
            <ChatRoutes />
          </PrivateRoutes>
        }
      />
    </Routes>
  );
};

export default AppRoutes;