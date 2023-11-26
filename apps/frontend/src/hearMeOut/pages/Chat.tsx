import { Toaster } from 'sonner';
import { ConversationsSidebar, ChatView, GroupSettings } from '../components/';
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

  const setShowGroupSettings = useChatStore(
    (state) => state.setShowGroupSettings
  );

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
    setShowGroupSettings(false);
  }, [currentConversationId]);

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
        <GroupSettings />
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};
