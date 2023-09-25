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

  const sendFriendRequest = (toId: string) => {
    socket?.emit(SOCKET_CHAT_EVENTS.friendRequest, {
      toId
    });
  };

  const acceptFriendRequest = (id: string) => {
    socket?.emit(SOCKET_CHAT_EVENTS.acceptFriendRequest, id);
  };

  return {
    sendMessage,
    sendTyping,
    sendTypingOff,
    sendFriendRequest,
    acceptFriendRequest
  };
};
