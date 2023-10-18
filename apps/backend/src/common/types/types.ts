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
