import { type ChangeEvent } from 'react';

export type InputEvent = ChangeEvent<HTMLInputElement>;
export type ButtonEvent = ChangeEvent<HTMLButtonElement>;
export type TextAreaEvent = ChangeEvent<HTMLTextAreaElement>;

export interface EmojiProps {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
}

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

export enum HttpStatusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}
