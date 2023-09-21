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
  const { setChats, setGroups, setActive } = useChatStore((state) => state);

  useEffect(() => {
    async function handleVerify() {
      // TODO: TYPE RESP
      const { data } = await verify();

      if (!data) {
        return;
      }

      const { groups, adminGroups, friends, ...account } = data;

      console.log(friends?.[0]);
      setChats(friends);
      setActive(friends?.[0]);
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
