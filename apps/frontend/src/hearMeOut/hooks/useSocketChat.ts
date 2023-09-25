import { useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getEnvVariables } from '../../helpers/getEnvVariables';
import { useAccountStore, useChatStore } from '../../store';
import { SOCKET_CHAT_EVENTS } from '../../types/types';
import type {
  ConversationDetails,
  MessageDetails,
  UserTyping
} from '../../store/types/types';
import { setActiveConversationFirst } from '../../services/hearMeOutAPI';

export const useSocketChat = () => {
  const {
    setSocket,
    clearSocket,
    setConversationIsOnline,
    addConversationMessage,
    addUserTyping,
    removeUserTyping,
    getActiveConversations,
    addActiveConversation,
    addConversation,
    socket
  } = useChatStore((state) => state);
  const { addFriendRequest } = useAccountStore();

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
  }, [socket]);

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

    socket.on(SOCKET_CHAT_EVENTS.message, async (message: MessageDetails) => {
      const activeConversations = getActiveConversations();
      const conversation = activeConversations.find(
        (conversation) => conversation.id === message.toId
      );
      if (!conversation) {
        addActiveConversation(message.toId);
        await setActiveConversationFirst(message.toId);
      }
      addConversationMessage(message.toId, message);
    });

    socket.on(SOCKET_CHAT_EVENTS.typing, (typing: UserTyping) => {
      addUserTyping(typing);
    });

    socket.on(SOCKET_CHAT_EVENTS.typingOff, (userTyping: UserTyping) => {
      removeUserTyping(userTyping);
    });

    socket.on(
      SOCKET_CHAT_EVENTS.newConversation,
      async (conversation: ConversationDetails) => {
        addConversation(conversation);
        addActiveConversation(conversation.id);
      }
    );

    socket.on(SOCKET_CHAT_EVENTS.friendRequest, (friendRequest: any) => {
      addFriendRequest(friendRequest);
    });

    socket.on(
      SOCKET_CHAT_EVENTS.acceptFriendRequest,
      (friend: ConversationDetails) => {
        addConversation(friend);
      }
    );
  }, [socket]);

  return {
    connectSocketChat,
    disconnectSocketChat
  };
};
