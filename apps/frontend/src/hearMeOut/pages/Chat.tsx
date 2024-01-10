import { Toaster, toast } from 'sonner';
import { Sidebar, GroupSettings, ChatView } from '../components/';
import { useEffect } from 'react';
import { useAccountStore, useChatStore } from '../../store';
import { useSocketChatEvents } from '../hooks/useSocketChatEvents';
import { ConversationTypes } from '../../store/types/types';
import { getAllConversationMessages } from '../../services/hearMeOutAPI';
import { HttpStatusCodes } from '../../types/types';
import { useSocketChat } from '../hooks/useSocketChat';
import { capitalize } from '../helpers';

export const Chat: React.FC = () => {
  const { connectSocketChat, disconnectSocketChat } = useSocketChat();
  const { sendOpenChat } = useSocketChatEvents();
  const isAuthenticated = useAccountStore((state) => state.isAuthenticated);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const setConversationMessages = useChatStore(
    (state) => state.setConversationMessages
  );
  const { id: ownUserId } = useAccountStore((state) => state.account!);
  const clearReplyMessage = useChatStore((state) => state.clearReplyMessage);
  const currentConversation = useChatStore((state) => state.conversations).find(
    (el) => el.id === currentConversationId
  );
  const socket = useChatStore((state) => state.socket);
  const conversations = useChatStore((state) => state.conversations);
  const setShowGroupSettings = useChatStore(
    (state) => state.setShowGroupSettings
  );

  useEffect(() => {
    if (!currentConversationId) {
      return;
    }

    sendOpenChat(currentConversationId);
  }, [currentConversationId, socket]);

  useEffect(() => {
    if (!currentConversation) {
      return;
    }
    const { username } = currentConversation.users.find(
      ({ id }) => id !== ownUserId
    )!;
    const title =
      currentConversation.type === ConversationTypes.chat
        ? username
        : currentConversation.name;

    document.title = `${capitalize(title)} | HearMeOut`;
  }, [currentConversation]);

  useEffect(() => {
    async function fetchMessages() {
      if (!currentConversationId) {
        return;
      }

      const { data, status } = await getAllConversationMessages(
        currentConversationId
      );

      if (status >= HttpStatusCodes.BAD_REQUEST) {
        toast.error('There was an error fetching messages');
      }

      setConversationMessages(currentConversationId, data);
    }

    const doesConversationMessagesExists = Boolean(
      conversations.find((el) => currentConversationId === el.id)?.messages
    );

    // clear replying message when navigating between chats
    clearReplyMessage();

    // close group settings when navigating between chats
    if (currentConversation?.type === ConversationTypes.group) {
      setShowGroupSettings(false);
    }

    // Fetch all the messages only if they don't exist already
    if (!doesConversationMessagesExists) {
      fetchMessages();
    }
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
        <Sidebar />
        <ChatView />
        {currentConversation?.type === ConversationTypes.group && (
          <GroupSettings />
        )}
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};
