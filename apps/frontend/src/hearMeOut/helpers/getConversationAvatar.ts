import {
  ConversationTypes,
  type ConversationDetails
} from '@store/types/types';

export const getConversationAvatar = (
  searchConversation: ConversationDetails
): string | undefined =>
  searchConversation.type === ConversationTypes.group
    ? searchConversation.icon
    : searchConversation.users[0]!.avatar;
