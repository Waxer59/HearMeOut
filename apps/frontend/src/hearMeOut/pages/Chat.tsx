import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';
import { useSocketChatEvents } from '@hearmeout/hooks/useSocketChatEvents';
import { ConversationTypes } from '@store/types/types';
import { getAllConversationMessages } from '@services/hearMeOutAPI';
import { BROADCAST_CHANEL_KEY, HttpStatusCodes } from '@/types/types';
import { useAccountStore } from '@store/account';
import { useChatStore } from '@store/chat';
import { useUiStore } from '@store/ui';
import { ChatView } from '@hearmeout/components/chat/ChatView';
import { GroupSettings } from '@hearmeout/components/GroupSettings';
import { Sidebar } from '@hearmeout/components/sidebar/Sidebar';
import { capitalize } from '@hearmeout/helpers/capitalize';
import { Calling } from '@hearmeout/components/call/Calling';
import { getConversationName } from '../helpers/getConversationName';

export const Chat: React.FC = () => {
  const { sendOpenChat } = useSocketChatEvents();
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const socket = useChatStore((state) => state.socket);
  const conversation = useChatStore((state) => state.conversations).find(
    (c) => c.id === currentConversationId
  );
  const setConversationMessages = useChatStore(
    (state) => state.setConversationMessages
  );
  const setCurrentConversationId = useChatStore(
    (state) => state.setCurrentConversationId
  );
  const replyMessage = useChatStore((state) => state.replyMessage);
  const clearReplyMessage = useChatStore((state) => state.clearReplyMessage);
  const setShowGroupSettings = useUiStore(
    (state) => state.setShowGroupSettings
  );
  const removeConversationNotification = useAccountStore(
    (state) => state.removeConversationNotification
  );

  useEffect(() => {
    if (!currentConversationId) {
      return;
    }

    sendOpenChat(currentConversationId);
  }, [currentConversationId, sendOpenChat, socket]);

  useEffect(() => {
    if (!conversation) {
      return;
    }

    const conversationName = getConversationName(conversation);

    document.title = `${capitalize(conversationName)} | HearMeOut`;
  }, [conversation]);

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

    // Sync the current conversation id with the broadcast channel
    const bc = new BroadcastChannel(BROADCAST_CHANEL_KEY.currentConversationId);

    bc.postMessage(currentConversationId);

    bc.onmessage = (event) => {
      const { data } = event;
      setCurrentConversationId(data);
    };

    const doesConversationMessagesExists = Boolean(conversation?.messages);

    // clear replying message when navigating between chats
    if (replyMessage) {
      clearReplyMessage();
    }

    if (currentConversationId) {
      removeConversationNotification(currentConversationId);
    }

    // close group settings when navigating between chats
    setShowGroupSettings(false);

    // Fetch all the messages only if they don't exist already
    if (!doesConversationMessagesExists) {
      fetchMessages();
    }

    return () => {
      bc.close();
    };
  }, [
    clearReplyMessage,
    conversation?.messages,
    currentConversationId,
    removeConversationNotification,
    replyMessage,
    setConversationMessages,
    setCurrentConversationId,
    setShowGroupSettings
  ]);

  return (
    <>
      <div className="flex h-screen relative">
        <Sidebar />
        <ChatView />
        {conversation?.type === ConversationTypes.group && <GroupSettings />}
        <Calling />
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};
