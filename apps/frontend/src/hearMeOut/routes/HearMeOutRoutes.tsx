import { Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Chat from '../pages/Chat';
import PrivateRoutes from './PrivateRoutes';

const HearMeOutRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />

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
