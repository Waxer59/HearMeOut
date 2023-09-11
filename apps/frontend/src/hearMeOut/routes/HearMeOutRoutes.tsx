import { Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Chat from '../pages/Chat';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import { useEffect } from 'react';
import { verify } from '../../services/hearMeOutAPI';
import { useAccountStore } from '../../store/account';

const HearMeOutRoutes = () => {
  const setAccount = useAccountStore((state) => state.setAccount);

  useEffect(() => {
    async function handleVerify() {
      const resp = await verify();

      if (!resp) {
        return;
      }

      setAccount(resp);
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
