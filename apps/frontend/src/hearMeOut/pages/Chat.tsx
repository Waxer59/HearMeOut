import { Toaster } from 'sonner';
import { ChatSidebar, ChatView } from '../components/';
import { useEffect } from 'react';
import { useAccountStore, useChatStore } from '../../store';
import { useSocketChat } from '../hooks/useSocketChat';
import { useSocketChatEvents } from '../hooks/useSocketChatEvents';

export const Chat = () => {
  const { connectSocketChat, disconnectSocketChat } = useSocketChat();
  const { sendOpenChat } = useSocketChatEvents();
  const isAuthenticated = useAccountStore((state) => state.isAuthenticated);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const socket = useChatStore((state) => state.socket);

  useEffect(() => {
    if (!currentConversationId) {
      return;
    }

    sendOpenChat(currentConversationId);
  }, [currentConversationId, socket]);

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
      <div className="flex h-full">
        <ChatSidebar />
        <ChatView />
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};
