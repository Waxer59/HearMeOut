import {
  ConversationTypes,
  type ConversationDetails
} from '@store/types/types';

export const getConversationIsOnline = (
  searchConversation: ConversationDetails
): boolean => {
  if (!searchConversation) {
    return false;
  }

  return searchConversation.type === ConversationTypes.group
    ? false
    : searchConversation.users[0]!.isOnline;
};
