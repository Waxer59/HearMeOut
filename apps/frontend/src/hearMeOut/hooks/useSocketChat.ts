import { useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getEnvVariables } from '../../helpers/getEnvVariables';
import { useAccountStore, useChatStore } from '../../store';
import {
  SOCKET_CHAT_EVENTS,
  type DeleteMessageDetails,
  type UpdateMessageDetails
} from '../../types/types';
import type {
  ConversationDetails,
  FriendRequestDetails,
  MessageDetails,
  UserTyping
} from '../../store/types/types';

export const useSocketChat = () => {
  const {
    addActiveConversation,
    addConversation,
    addConversationMessage,
    addUserTyping,
    clearSocket,
    currentConversationId,
    getActiveConversations,
    deleteConversationMessage,
    updateConversationMessage,
    removeConversation,
    removeUserTyping,
    setConversationIsOnline,
    setCurrentConversationId,
    setSocket,
    socket
  } = useChatStore((state) => state);
  const { addFriendRequest, addFriendRequestOutgoing, removeFriendRequest } =
    useAccountStore();

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

    socket.on(SOCKET_CHAT_EVENTS.userConnect, (userId: string) => {
      setConversationIsOnline(userId, true);
    });

    socket.on(SOCKET_CHAT_EVENTS.userDisconnect, (userId: string) => {
      setConversationIsOnline(userId, false);
    });

    socket.on(SOCKET_CHAT_EVENTS.message, async (message: MessageDetails) => {
      const activeConversations = getActiveConversations();
      const conversation = activeConversations.find(
        (conversation) => conversation.id === message.toId
      );
      if (!conversation) {
        addActiveConversation(message.toId);
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
        addActiveConversation(friend.id);
        addConversation(friend);
      }
    );

    socket.on(SOCKET_CHAT_EVENTS.removeConversation, (id: string) => {
      if (currentConversationId === id) {
        setCurrentConversationId(null);
      }

      removeConversation(id);
    });

    socket.on(
      SOCKET_CHAT_EVENTS.friendRequestOutgoing,
      (friendRequest: FriendRequestDetails) => {
        addFriendRequestOutgoing(friendRequest);
      }
    );

    socket.on(SOCKET_CHAT_EVENTS.createGroup, (group: ConversationDetails) => {
      addConversation(group);
      addActiveConversation(group.id);
    });

    socket.on(SOCKET_CHAT_EVENTS.removeFriendRequest, (id: string) => {
      removeFriendRequest(id);
    });

    socket.on(
      SOCKET_CHAT_EVENTS.deleteMessage,
      ({ messageId, conversationId }: DeleteMessageDetails) => {
        deleteConversationMessage(conversationId, messageId);
      }
    );

    socket.on(
      SOCKET_CHAT_EVENTS.updateMessage,
      ({ content, conversationId, messageId }: UpdateMessageDetails) => {
        updateConversationMessage(conversationId, messageId, content);
      }
    );
  }, [socket]);

  return {
    connectSocketChat,
    disconnectSocketChat
  };
};
