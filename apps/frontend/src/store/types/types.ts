export interface AccountDetails {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  isGithubAccount: boolean;
  configuration?: SettingsDetails;
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
  toId: string;
  content: string;
  viewedByAll: boolean;
  viewedByIds: string[];
  createdAt: Date;
  replyId?: string;
  from: AccountDetails;
  conversationId: string;
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
  name: null;
  type: ConversationTypes;
  icon: null;
  creatorId: null;
  userIds: string[];
  messages: MessageDetails[];
  adminIds: any[];
  users: AccountDetails[];
}

export interface UserTyping {
  userId: string;
  conversationId: string;
}
