export interface AccountDetails {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  isGithubAccount: boolean;
  configuration?: SettingsDetails;
  conversationNotificationIds: string[];
  activeConversationIds: string[];
}

export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface SettingsDetails {
  theme: ThemeEnum;
}

export interface MessageDetails {
  id: string;
  fromId: string;
  conversationId: string;
  content: string;
  viewedByAll: boolean;
  createdAt: Date;
  replyId?: string;
  from: AccountDetails;
  isEdited: boolean;
}

export interface FriendRequestDetails {
  id: string;
  fromId: string;
  toId: string;
  from: AccountDetails;
  to: AccountDetails;
}

export enum ConversationTypes {
  chat = 'chat',
  group = 'group'
}

export interface ConversationDetails {
  id: string;
  name: string;
  type: ConversationTypes;
  icon?: string;
  creatorId: null;
  userIds: string[];
  messages: MessageDetails[];
  adminIds: any[];
  users: AccountDetails[];
  joinCode?: string;
}

export interface UserTyping {
  userId: string;
  conversationId: string;
}
