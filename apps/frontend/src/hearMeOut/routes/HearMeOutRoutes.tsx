import { Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Chat from '../pages/Chat';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import { useEffect } from 'react';
import { verify } from '../../services/hearMeOutAPI';
import { useAccountStore, useChatStore } from '../../store';
import type { VerifyResponse } from '../../types/types';

const HearMeOutRoutes = () => {
  const setAccount = useAccountStore((state) => state.setAccount);
  const { setConversations, setActive, setCurrentConversationId } =
    useChatStore((state) => state);

  // TODO: SYNC TABS ON LOGIN/OUT
  useEffect(() => {
    async function handleVerify() {
      const { data }: { data: VerifyResponse } = await verify();

      if (!data) {
        return;
      }

      const { conversationsJoined, activeConversationIds, ...account } = data;

      setCurrentConversationId(
        conversationsJoined.filter((el) =>
          activeConversationIds.includes(el.id)
        )?.[0]?.id ?? null
      );
      setActive(activeConversationIds);
      setConversations(conversationsJoined);

      setAccount(account);
    }

    handleVerify();
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
