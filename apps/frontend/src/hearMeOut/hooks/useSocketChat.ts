import { useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getEnvVariables } from '../../helpers/getEnvVariables';
import { useChatStore } from '../../store';
import { SOCKET_CHAT_EVENTS } from '../../types/types';
import type { MessageDetails, UserTyping } from '../../store/types/types';

export const useSocketChat = () => {
  const {
    setSocket,
    clearSocket,
    socket,
    setConversationIsOnline,
    addConversationMessage,
    currentConversationId,
    addUserTyping,
    removeUserTyping
  } = useChatStore((state) => state);

  const connectSocketChat = useCallback(() => {
    const socketTmp = io(`${getEnvVariables().VITE_HEARMEOUT_API}`, {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: true,
      forceNew: true
    });
    setSocket(socketTmp);
  }, [getEnvVariables().VITE_HEARMEOUT_API]);

  const disconnectSocketChat = useCallback(() => {
    socket?.disconnect();
    clearSocket();
  }, []);

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

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(SOCKET_CHAT_EVENTS.userConnect, (userId) => {
      setConversationIsOnline(userId, true);
    });

    socket.on(SOCKET_CHAT_EVENTS.userDisconnect, (userId) => {
      setConversationIsOnline(userId, false);
    });

    socket.on(SOCKET_CHAT_EVENTS.message, (message: MessageDetails) => {
      addConversationMessage(message.toId, message);
    });

    socket.on(SOCKET_CHAT_EVENTS.typing, (typing: UserTyping) => {
      addUserTyping(typing);
    });

    socket.on(SOCKET_CHAT_EVENTS.typingOff, (userTyping: UserTyping) => {
      removeUserTyping(userTyping);
    });
  }, [socket]);

  return {
    connectSocketChat,
    disconnectSocketChat,
    sendMessage,
    sendTyping,
    sendTypingOff
  };
};
