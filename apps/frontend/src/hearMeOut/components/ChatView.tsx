import { useEffect } from 'react';
import { useSocketChat } from '../hooks/useSocketChat';
import { ChatMessages, ChatInput, ChatTitle } from './';

export const ChatView = () => {
  const { connectSocketChat, disconnectSocketChat } = useSocketChat();

  useEffect(() => {
    connectSocketChat();

    return () => {
      disconnectSocketChat();
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 justify-between">
      <ChatTitle />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};
