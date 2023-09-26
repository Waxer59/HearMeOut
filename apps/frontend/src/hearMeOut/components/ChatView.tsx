import { useEffect } from 'react';
import { useSocketChat } from '../hooks/useSocketChat';
import { ChatMessages, ChatInput, ChatTitle } from './';
import { useAccountStore, useChatStore } from '../../store';
import { NotFoundIcon } from './Icons';

export const ChatView = () => {
  const { connectSocketChat, disconnectSocketChat } = useSocketChat();
  const { isAuthenticated } = useAccountStore();
  const { currentConversationId } = useChatStore();

  useEffect(() => {
    connectSocketChat();
  }, [connectSocketChat]);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocketChat();
    }
  }, [isAuthenticated, disconnectSocketChat]);

  return (
    <>
      {currentConversationId ? (
        <div className="flex flex-col flex-1 justify-between">
          <ChatTitle />
          <ChatMessages />
          <ChatInput />
        </div>
      ) : (
        <div className="flex flex-col flex-1 justify-center items-center gap-32">
          <h2 className="text-2xl font-bold">
            Looks like you don't have any conversations yet
          </h2>
          <NotFoundIcon className="w-96" />
        </div>
      )}
    </>
  );
};
