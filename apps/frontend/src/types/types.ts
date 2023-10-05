import { type ChangeEvent } from 'react';
import type {
  ConversationDetails,
  FriendRequestDetails
} from '../store/types/types';

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

export interface UserDetails {
  id: string;
  username: string;
  avatar?: string;
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

export interface VerifyResponse {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  conversationIds: string[];
  adminConversationIds: any[];
  activeConversationIds: string[];
  conversationsJoined: ConversationDetails[];
  friendReqTos: FriendRequestDetails[];
  friendReqFroms: FriendRequestDetails[];
}

export enum SOCKET_CHAT_EVENTS {
  userConnect = 'userConnect',
  userDisconnect = 'userDisconnect',
  friendRequest = 'friendRequest',
  acceptFriendRequest = 'acceptFriendRequest',
  message = 'message',
  typing = 'typing',
  typingOff = 'typingOff',
  newConversation = 'newConversation',
  removeConversation = 'removeConversation',
  friendRequestOutgoing = 'friendRequestOutgoing',
  removeFriendRequest = 'removeFriendRequest',
  createGroup = 'createGroup'
}
