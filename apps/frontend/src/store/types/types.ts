export interface AccountDetails {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
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
  viewed: boolean;
  createdAt: Date;
  replyId?: string;
  from: AccountDetails;
}

export interface ChatDetails {
  id: string;
  usersId: string[];
  messagesId: string[];
  messages: MessageDetails[];
  users: AccountDetails[];
}

export interface GroupDetails {
  id: string;
  name: string;
  icon: string;
  creatorId: string;
  usersId: string[];
  messagesId: string[];
  adminsId: string[];
}
