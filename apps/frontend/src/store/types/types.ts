export interface AccountDetails {
  id: string;
  username: string;
  avatar?: string;
}

export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface SettingsDetails {
  theme: ThemeEnum;
}

export interface ChatDetails {
  id: string;
  usersId: string[];
  messagesId: string[];
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
