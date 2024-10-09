import { Route, Routes } from 'react-router-dom';
import { LOCAL_STORAGE_ITEMS, type VerifyResponse } from '@/types/types';
import { verify } from '@services/hearMeOutAPI';
import { useLocalStorage } from '@hearmeout/hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { ChatRoutes } from '@hearmeout/routes/ChatRoutes';
import { PrivateRoutes } from '@/router/PrivateRoutes';
import { PublicRoutes } from '@/router/PublicRoutes';
import { useAccountStore } from '@store/account';
import { useChatStore } from '@store/chat';
import SignIn from '@hearmeout/pages/SignIn';
import SignUp from '@hearmeout/pages/SignUp';

const HearMeOutRoutes = () => {
  const setAccount = useAccountStore((state) => state.setAccount);
  const setFriendRequests = useAccountStore((state) => state.setFriendRequests);
  const setFriendRequestsOutgoing = useAccountStore(
    (state) => state.setFriendRequestsOutgoing
  );
  const setSettings = useAccountStore((state) => state.setSettings);
  const setConversations = useChatStore((state) => state.setConversations);
  const setActiveConversations = useChatStore(
    (state) => state.setActiveConversations
  );
  const setCurrentConversationId = useChatStore(
    (state) => state.setCurrentConversationId
  );
  const { setLocalStorageItem, getLocalStorageItem } = useLocalStorage();
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

      setActiveConversations(account.activeConversationIds);
      setConversations(conversations);
      setFriendRequestsOutgoing(friendReqFroms);
      setCurrentConversationId(
        conversations.filter((el) =>
          account.activeConversationIds.includes(el.id)
        )?.[0]?.id ?? null
      );

      if (account.configuration) {
        setSettings(account.configuration);
      }

      setAccount(account);
      setFriendRequests(friendReqTos);
      setIsLoading(false);
    }

    function handleStorage(e: StorageEvent) {
      if (e.key === LOCAL_STORAGE_ITEMS.isAuth) {
        if (getLocalStorageItem(LOCAL_STORAGE_ITEMS.isAuth)) {
          window.location.reload();
        } else {
          window.location.replace('/');
        }
      }
    }

    if (!isAuthenticated) {
      handleVerify();
    }

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [
    getLocalStorageItem,
    isAuthenticated,
    setAccount,
    setActiveConversations,
    setConversations,
    setCurrentConversationId,
    setFriendRequests,
    setFriendRequestsOutgoing,
    setLocalStorageItem,
    setSettings
  ]);

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

export default HearMeOutRoutes;
