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
import { FriendRequestsService } from 'src/friend-requests/friend-requests.service';

@Injectable()
export class ChatWsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly messageService: MessagesService,
    private readonly friendRequestsService: FriendRequestsService,
  ) {}

  async userOnline(client: Socket, user: User): Promise<void> {
    const { id: userId, conversationIds } = user;

    try {
      await this.usersService.setIsOnline(userId, true);
    } catch (error) {
      client.disconnect();
      return;
    }

    // Join user to conversation rooms
    client.join(userId);

    conversationIds.forEach((conversationId) => {
      client.join(conversationId);
      client.broadcast.to(conversationId).emit(CHAT_EVENTS.userConnect, userId);
    });
  }

  async userOffline(client: Socket, user: User): Promise<void> {
    const { id: userId, conversationIds } = user;

    try {
      await this.usersService.setIsOnline(userId, false);
    } catch (error) {
      client.disconnect();
      return;
    }

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
    try {
      const message = await this.messageService.create({
        ...sendMessageDto,
        fromId: userId,
      });
      server.to(sendMessageDto.toId).emit(CHAT_EVENTS.message, message);
    } catch (error) {}
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

  async friendRequest(
    fromId: string,
    toId: string,
    client: Socket,
  ): Promise<void> {
    try {
      const request = await this.friendRequestsService.create(fromId, toId);
      client.to(toId).emit(CHAT_EVENTS.friendRequest, request);
    } catch (error) {}
  }

  async acceptFriendRequest(
    friendRequestId: string,
    userId: string,
    client: Socket,
  ): Promise<void> {
    try {
      const request =
        await this.friendRequestsService.findById(friendRequestId);

      if (request.toId !== userId) {
        return;
      }

      const acceptedRequest =
        await this.friendRequestsService.accept(friendRequestId);

      client
        .to(request.toId)
        .emit(CHAT_EVENTS.acceptFriendRequest, acceptedRequest);
    } catch (error) {}
  }

  async getUserIdAuth(client: Socket): Promise<User> {
    const rawCookies = client.request.headers.cookie;
    const parsedCookies = parseCookies(rawCookies);

    if (!parseCookies) {
      client.disconnect();
      return;
    }

    const token = parsedCookies[AUTH_COOKIE];

    try {
      return await this.authService.verify(token);
    } catch (err) {
      client.disconnect();
    }
  }
}
