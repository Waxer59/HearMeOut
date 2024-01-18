import {
  Configuration,
  Conversation,
  FriendRequest,
  Message,
  User,
} from '@prisma/client';
import type { Socket } from 'socket.io';

export type SocketIOMiddleware = {
  (client: Socket, next: (err?: any) => void);
};

export interface JwtPayloadDetails {
  id: string;
}

export interface ConversationWithRelations extends Conversation {
  users?: User[];
}

export interface MessageWithRelations extends Message {
  from?: User;
  replies?: Message[];
  conversation?: Conversation;
}

export interface UserWithRelations extends User {
  conversations?: ConversationWithRelations[];
  configuration?: Configuration;
  friendReqFroms?: FriendRequest[];
  friendReqTos?: FriendRequest[];
}

export interface ICloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  api_key: string;
}

export enum CONVERSATION_TYPE {
  chat = 'chat',
  group = 'group',
}

export enum NodeEnvironment {
  DEV = 'DEV',
  PROD = 'PROD',
  TEST = 'TEST',
}
