import { Injectable } from '@nestjs/common';
import { AUTH_COOKIE, CHAT_EVENTS } from 'src/common/constants/constants';
import { parseCookies } from 'src/common/helpers/cookies';
import type { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { MessagesService } from 'src/messages/messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { TypingDto } from './dto/typing.dto';

@Injectable()
export class ChatWsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly messageService: MessagesService,
  ) {}

  async userOnline(client: Socket, user: User): Promise<void> {
    const { id: userId, conversationIds } = user;

    await this.usersService.setIsOnline(userId, true);

    // Join user to conversation rooms
    client.join(userId);

    conversationIds.forEach((conversationId) => {
      client.join(conversationId);
      client.broadcast.to(conversationId).emit(CHAT_EVENTS.userConnect, userId);
    });
  }

  async userOffline(client: Socket, user: User): Promise<void> {
    const { id: userId, conversationIds } = user;

    await this.usersService.setIsOnline(userId, false);

    conversationIds.forEach((conversationId) => {
      client.join(conversationId);
      client.broadcast
        .to(conversationId)
        .emit(CHAT_EVENTS.userDisconnect, userId);
    });
  }

  async sendMessage(
    userId: string,
    sendMessageDto: SendMessageDto,
    server: Server,
  ): Promise<void> {
    const message = await this.messageService.create({
      ...sendMessageDto,
      fromId: userId,
    });
    server.to(sendMessageDto.toId).emit(CHAT_EVENTS.message, message);
  }

  async typing(
    { conversationId }: TypingDto,
    userId: string,
    client: Socket,
  ): Promise<void> {
    client.broadcast
      .to(conversationId)
      .emit(CHAT_EVENTS.typing, { userId, conversationId });
  }

  async typingOff(
    { conversationId }: TypingDto,
    userId: string,
    client: Socket,
  ): Promise<void> {
    client.broadcast
      .to(conversationId)
      .emit(CHAT_EVENTS.typingOff, { userId, conversationId });
  }

  async getUserIdAuth(client: Socket): Promise<User> {
    const rawCookies = client.request.headers.cookie;
    const parsedCookies = parseCookies(rawCookies);
    const token = parsedCookies[AUTH_COOKIE];

    try {
      return await this.authService.verify(token);
    } catch (err) {
      client.disconnect();
    }
  }
}
