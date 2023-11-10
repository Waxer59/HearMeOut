import { Conversation, User } from '@prisma/client';
import type { Socket } from 'socket.io';

export type SocketIOMiddleware = {
  (client: Socket, next: (err?: any) => void);
};

export enum CONVERSATION_TYPE {
  chat = 'chat',
  group = 'group',
}

export interface ConversationDetails extends Conversation {
  users: User[];
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
  tags: any[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  info: Info;
  api_key: string;
}

export interface Info {
  categorization: Categorization;
}

export interface Categorization {
  google_tagging: GoogleTagging;
}

export interface GoogleTagging {
  status: string;
  data: Datum[];
}

export interface Datum {
  tag: string;
  confidence: number;
}
