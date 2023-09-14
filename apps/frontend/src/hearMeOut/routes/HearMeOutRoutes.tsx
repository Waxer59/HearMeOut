import { Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Chat from '../pages/Chat';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import { useEffect } from 'react';
import { verify } from '../../services/hearMeOutAPI';
import { useAccountStore, useChatStore } from '../../store';

const HearMeOutRoutes = () => {
  const setAccount = useAccountStore((state) => state.setAccount);
  const { setChats, setGroups } = useChatStore((state) => state);

  useEffect(() => {
    async function handleVerify() {
      const { data } = await verify();

      if (!data) {
        return;
      }

      const { chats, groups, adminGroups, ...account } = data;

      setChats(chats);
      setGroups(groups);

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
