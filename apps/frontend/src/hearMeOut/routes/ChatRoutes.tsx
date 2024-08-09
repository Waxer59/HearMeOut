import { Route, Routes } from 'react-router-dom';
import { Chat } from '@hearmeout/pages/Chat';
import { Profile } from '@hearmeout/pages/Profile';

export const ChatRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};
