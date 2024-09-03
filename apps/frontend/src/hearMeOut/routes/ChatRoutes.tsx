import { Route, Routes } from 'react-router-dom';
import { Chat } from '@hearmeout/pages/Chat';
import { Profile } from '@hearmeout/pages/Profile';
import { useEffect } from 'react';
import { useSocketChat } from '@hearmeout/hooks/useSocketChat';

export const ChatRoutes = () => {
  const { connectSocketChat } = useSocketChat();

  useEffect(() => {
    connectSocketChat();
  }, [connectSocketChat]);

  return (
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};
