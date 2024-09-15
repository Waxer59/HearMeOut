import {
  type ConversationDetails,
  ConversationTypes
} from '@store/types/types';

export const getConversationName = (
  searchConversation: ConversationDetails
): string =>
  searchConversation.type === ConversationTypes.group
    ? searchConversation.name
    : searchConversation.users[0].username;
