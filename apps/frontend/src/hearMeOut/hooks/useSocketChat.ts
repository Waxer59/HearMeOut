import { useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getEnvVariables } from '@helpers/getEnvVariables';
import { addActiveConversation as addActiveConversationAPI } from '@services/hearMeOutAPI';
import { CHAT_EVENTS } from 'ws-types';
import {
  LOCAL_STORAGE_ITEMS,
  type DeleteMessageDetails,
  type RemoveFriendRequestDetails,
  type UpdateMessageDetails
} from '@/types/types';
import type {
  ConversationDetails,
  FriendRequestDetails,
  MessageDetails,
  UserTyping
} from '@store/types/types';
import { useChatStore } from '@store/chat';
import { useAccountStore } from '@store/account';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';
import { useCallStore } from '@/store/call';

export const useSocketChat = () => {
  const {
    socket,
    addActiveConversation,
    addConversation,
    addConversationMessage,
    addUserTyping,
    clearSocket,
    getActiveConversations,
    deleteConversationMessage,
    updateConversationMessage,
    removeConversation,
    removeUserTyping,
    setConversationIsOnline,
    updateConversation,
    setSocket
  } = useChatStore((state) => state);
  const { setLocalStorageItem } = useLocalStorage();
  const {
    account,
    addFriendRequest,
    addFriendRequestOutgoing,
    removeFriendRequest,
    removeFriendRequestOutgoing,
    addConversationNotification
  } = useAccountStore((state) => state);
  const { id: ownUserId } = account!;

  const connectSocketChat = useCallback(() => {
    const socketTmp = io(`${getEnvVariables().VITE_HEARMEOUT_API}`, {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: true,
      forceNew: true
    });
    setSocket(socketTmp);
  }, []);

  const peerConnection = useCallStore((state) => state.peerConnection);

  const disconnectSocketChat = useCallback(() => {
    socket?.disconnect();
    clearSocket();
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(CHAT_EVENTS.userConnect, (userId: string) => {
      setConversationIsOnline(userId, true);
    });

    socket.on(CHAT_EVENTS.userDisconnect, (userId: string) => {
      setConversationIsOnline(userId, false);
    });

    socket.on(CHAT_EVENTS.message, async (message: MessageDetails) => {
      const activeConversations = getActiveConversations();
      const activeConversation = activeConversations.find(
        (conversation) => conversation.id === message.conversationId
      );

      if (!activeConversation) {
        addActiveConversation(message.conversationId);
        await addActiveConversationAPI(message.conversationId);
      }

      addConversationMessage(message.conversationId, message);
    });

    socket.on(CHAT_EVENTS.typing, (userTyping: UserTyping) => {
      // The user can have multiple tabs
      if (userTyping.userId !== ownUserId) {
        addUserTyping(userTyping);
      }
    });

    socket.on(CHAT_EVENTS.typingOff, (userTyping: UserTyping) => {
      // The user can have multiple tabs
      if (userTyping.userId !== ownUserId) {
        removeUserTyping(userTyping);
      }
    });

    socket.on(
      CHAT_EVENTS.newConversation,
      async (conversation: ConversationDetails) => {
        addConversation(conversation);
        addActiveConversation(conversation.id);
        toast.info(`New conversation: ${conversation.name}`);
      }
    );

    socket.on(CHAT_EVENTS.friendRequest, (friendRequest: any) => {
      addFriendRequest(friendRequest);
    });

    socket.on(
      CHAT_EVENTS.acceptFriendRequest,
      (friend: ConversationDetails) => {
        addActiveConversation(friend.id);
        addConversation(friend);
      }
    );

    socket.on(CHAT_EVENTS.removeConversation, (id: string) => {
      removeConversation(id);
    });

    socket.on(CHAT_EVENTS.updateGroup, (newGroup: ConversationDetails) => {
      updateConversation(newGroup);
    });

    socket.on(
      CHAT_EVENTS.friendRequestOutgoing,
      (friendRequest: FriendRequestDetails) => {
        addFriendRequestOutgoing(friendRequest);
      }
    );

    socket.on(
      CHAT_EVENTS.removeFriendRequest,
      ({ id, isOutgoing }: RemoveFriendRequestDetails) => {
        if (isOutgoing) {
          removeFriendRequestOutgoing(id);
        } else {
          removeFriendRequest(id);
        }
      }
    );

    socket.on(
      CHAT_EVENTS.deleteMessage,
      ({ messageId, conversationId }: DeleteMessageDetails) => {
        deleteConversationMessage(conversationId, messageId);
      }
    );

    socket.on(CHAT_EVENTS.deleteAccount, () => {
      setLocalStorageItem(LOCAL_STORAGE_ITEMS.isAuth, false);
      window.location.reload();
    });

    socket.on(
      CHAT_EVENTS.updateMessage,
      ({ content, conversationId, messageId }: UpdateMessageDetails) => {
        updateConversationMessage(conversationId, messageId, content);
      }
    );

    socket.on(CHAT_EVENTS.notification, ({ id }: { id: string }) => {
      addConversationNotification(id);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on(CHAT_EVENTS.answer, (answer: string) => {
      const parsedAnswer = JSON.parse(answer);
      peerConnection?.setRemoteDescription(
        new RTCSessionDescription(parsedAnswer)
      );
    });

    socket.on(CHAT_EVENTS.offer, (offer: RTCSessionDescriptionInit) => {
      peerConnection?.setRemoteDescription(offer);
    });

    socket.on(CHAT_EVENTS.candidate, (candidate: RTCIceCandidateInit) => {
      peerConnection?.addIceCandidate(candidate);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, peerConnection]);

  return {
    connectSocketChat,
    disconnectSocketChat
  };
};
