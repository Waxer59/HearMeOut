import type { ChangeEvent } from 'react';
import type {
  AccountDetails,
  ConversationDetails,
  FriendRequestDetails
} from '../store/types/types';

export type InputEvent = ChangeEvent<HTMLInputElement>;
export type ButtonEvent = ChangeEvent<HTMLButtonElement>;
export type TextAreaEvent = ChangeEvent<HTMLTextAreaElement>;

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export interface SignInDetails {
  username: string;
  password: string;
}

export interface CreateAccount {
  username: string;
  password: string;
}

export interface UpdateAccount {
  username?: string;
  password?: string;
}

export interface EmojiProps {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
}

export interface VerifyResponse extends AccountDetails {
  conversationIds: string[];
  adminConversationIds: any[];
  activeConversationIds: string[];
  conversations: ConversationDetails[];
  friendReqTos: FriendRequestDetails[];
  friendReqFroms: FriendRequestDetails[];
}

export interface IResponseData {
  data: any;
  status: number;
}

export interface DeleteMessageDetails {
  conversationId: string;
  messageId: string;
}

export interface RemoveFriendRequestDetails {
  id: string;
  isOutgoing: boolean;
}

export interface UpdateMessageDetails {
  conversationId: string;
  messageId: string;
  content: string;
}

export interface UpdateGroupOptions {
  icon?: any;
  name?: string;
  kickUsers?: string[];
  addUsers?: string[];
  makeAdmins?: string[];
  removeAdmins?: string[];

  // 'true': generate a new join code
  // 'false': remove join code from the group
  joinCode?: boolean;
}

export enum LOCAL_STORAGE_ITEMS {
  isAuth = 'isAuth'
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

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export enum BROADCAST_CHANEL_KEY {
  currentConversationId = 'currentConversationId'
}
