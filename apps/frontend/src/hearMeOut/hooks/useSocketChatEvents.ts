import { useChatStore } from '../../store';
import { SOCKET_CHAT_EVENTS } from '../../types/types';

export const useSocketChatEvents = () => {
  const { currentConversationId, socket } = useChatStore((state) => state);

  const sendMessage = (content: string) => {
    socket?.emit(SOCKET_CHAT_EVENTS.message, {
      content,
      toId: currentConversationId
    });
  };

  const sendTyping = () => {
    socket?.emit(SOCKET_CHAT_EVENTS.typing, {
      conversationId: currentConversationId
    });
  };

  const sendTypingOff = () => {
    socket?.emit(SOCKET_CHAT_EVENTS.typingOff, {
      conversationId: currentConversationId
    });
  };

  const sendFriendRequest = (id: string) => {
    socket?.emit(SOCKET_CHAT_EVENTS.friendRequest, {
      id
    });
  };

  const sendAcceptFriendRequest = (id: string) => {
    socket?.emit(SOCKET_CHAT_EVENTS.acceptFriendRequest, { id });
  };

  const sendRemoveConversation = (id: string) => {
    socket?.emit(SOCKET_CHAT_EVENTS.removeConversation, { id });
  };

  return {
    sendMessage,
    sendTyping,
    sendTypingOff,
    sendFriendRequest,
    sendAcceptFriendRequest,
    sendRemoveConversation
  };
};