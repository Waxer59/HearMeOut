import { useChatStore } from '@store/chat';
import { type ConversationDetails } from '@/store/types/types';
import { getConversationAvatar } from '@hearmeout/helpers/getConversationAvatar';
import { getConversationIsOnline } from '@hearmeout/helpers/getConversationIsOnline';
import { getConversationName } from '@hearmeout/helpers/getConversationName';

export const useConversation = (id: string) => {
  const conversation = useChatStore((state) =>
    state.conversations.find((c) => c.id === id)
  ) as ConversationDetails;

  const getAvatar = () => getConversationAvatar(conversation);
  const getIsOnline = () => getConversationIsOnline(conversation);
  const getName = () => getConversationName(conversation);

  return {
    conversation,
    getAvatar,
    getIsOnline,
    getName
  };
};
