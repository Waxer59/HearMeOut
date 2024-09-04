import { CHAT_EVENTS } from 'ws-types';
import type { UpdateGroupOptions } from '@/types/types';
import { useChatStore } from '@store/chat';

export const useSocketChatEvents = () => {
  const { currentConversationId, socket } = useChatStore((state) => state);

  const sendMessage = (content: string, replyId: string = '') => {
    socket?.emit(CHAT_EVENTS.message, {
      content,
      replyId,
      conversationId: currentConversationId
    });
  };

  const sendTyping = () => {
    socket?.emit(CHAT_EVENTS.typing, {
      conversationId: currentConversationId
    });
  };

  const sendDeleteAccount = () => {
    socket?.emit(CHAT_EVENTS.deleteAccount);
  };

  const sendTypingOff = () => {
    socket?.emit(CHAT_EVENTS.typingOff, {
      conversationId: currentConversationId
    });
  };

  const sendFriendRequest = (userId: string) => {
    socket?.emit(CHAT_EVENTS.friendRequest, {
      userId
    });
  };

  const sendAcceptFriendRequest = (id: string) => {
    socket?.emit(CHAT_EVENTS.acceptFriendRequest, { id });
  };

  const sendRemoveConversation = (id: string) => {
    socket?.emit(CHAT_EVENTS.removeConversation, { id });
  };

  const sendCreateGroup = (name: string, userIds: string[]) => {
    socket?.emit(CHAT_EVENTS.createGroup, { name, userIds });
  };

  const sendRemoveFriendRequest = (id: string, isOutgoing: boolean) => {
    socket?.emit(CHAT_EVENTS.removeFriendRequest, { id, isOutgoing });
  };

  const sendOpenChat = (id: string) => {
    socket?.emit(CHAT_EVENTS.openChat, { id });
  };

  const sendDeleteMessage = (messageId: string) => {
    socket?.emit(CHAT_EVENTS.deleteMessage, { messageId });
  };

  const sendUpdateMessage = (messageId: string, content: string) => {
    socket?.emit(CHAT_EVENTS.updateMessage, { messageId, content });
  };

  const sendUpdateGroup = (id: string, options: UpdateGroupOptions) => {
    socket?.emit(CHAT_EVENTS.updateGroup, { id, ...options });
  };

  const sendExitGroup = (id: string) => {
    socket?.emit(CHAT_EVENTS.exitGroup, { id });
  };

  const sendJoinGroup = (joinCode: string) => {
    socket?.emit(CHAT_EVENTS.joinGroup, { joinCode });
  };

  const sendOffer = (conversationId: string, offer: string) => {
    socket?.emit(CHAT_EVENTS.offer, { conversationId, offer });
  };

  const sendCandidate = (conversationId: string, candidate: string) => {
    socket?.emit(CHAT_EVENTS.candidate, { conversationId, candidate });
  };

  const sendUserLeftCall = (conversationId: string) => {
    socket?.emit(CHAT_EVENTS.leftCall, conversationId);
  };

  const sendMuteUser = (conversationId: string) => {
    socket?.emit(CHAT_EVENTS.muteUser, conversationId);
  };

  const sendUnmuteUser = (conversationId: string) => {
    socket?.emit(CHAT_EVENTS.unmuteUser, conversationId);
  };

  return {
    sendMuteUser,
    sendUnmuteUser,
    sendUserLeftCall,
    sendCandidate,
    sendOffer,
    sendMessage,
    sendTyping,
    sendTypingOff,
    sendFriendRequest,
    sendAcceptFriendRequest,
    sendRemoveConversation,
    sendCreateGroup,
    sendRemoveFriendRequest,
    sendOpenChat,
    sendDeleteMessage,
    sendUpdateMessage,
    sendUpdateGroup,
    sendExitGroup,
    sendJoinGroup,
    sendDeleteAccount
  };
};
