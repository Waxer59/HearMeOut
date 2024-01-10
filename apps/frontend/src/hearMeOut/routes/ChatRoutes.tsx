import { Route, Routes } from 'react-router-dom';
import { Chat, Profile } from '../pages';

export const ChatRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};
