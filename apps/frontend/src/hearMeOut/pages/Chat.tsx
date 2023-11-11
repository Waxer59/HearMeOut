import { Toaster } from 'sonner';
import { ConversationsSidebar, ChatView } from '../components/';
import { useEffect } from 'react';
import { useAccountStore, useChatStore } from '../../store';
import { useSocketChat } from '../hooks/useSocketChat';
import { useSocketChatEvents } from '../hooks/useSocketChatEvents';

export const Chat: React.FC = () => {
  const { connectSocketChat, disconnectSocketChat } = useSocketChat();
  const { sendOpenChat } = useSocketChatEvents();
  const isAuthenticated = useAccountStore((state) => state.isAuthenticated);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const socket = useChatStore((state) => state.socket);

  useEffect(() => {
    document.title = 'Chat | HearMeOut';
  }, []);

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
      <div className="flex h-screen">
        <ConversationsSidebar />
        <ChatView />
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};
