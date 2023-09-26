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
import { ConversationsService } from 'src/conversations/conversations.service';
import { ConversationDto } from './dto/conversation.dto';
import { FriendRequestDto } from './dto/friend-request.dto';

@Injectable()
export class ChatWsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly messageService: MessagesService,
    private readonly friendRequestsService: FriendRequestsService,
    private readonly conversationsService: ConversationsService,
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
    typingDto: TypingDto,
    userId: string,
    client: Socket,
  ): Promise<void> {
    client.broadcast
      .to(typingDto.conversationId)
      .emit(CHAT_EVENTS.typing, { userId, ...typingDto });
  }

  async typingOff(
    typingDto: TypingDto,
    userId: string,
    client: Socket,
  ): Promise<void> {
    client.broadcast
      .to(typingDto.conversationId)
      .emit(CHAT_EVENTS.typingOff, { userId, ...typingDto });
  }

  async friendRequest(
    fromId: string,
    friendRequestDto: FriendRequestDto,
    client: Socket,
  ): Promise<void> {
    const { id } = friendRequestDto;
    try {
      const request = await this.friendRequestsService.create(fromId, id);
      client.to(id).emit(CHAT_EVENTS.friendRequest, request);
    } catch (error) {}
  }

  async acceptFriendRequest(
    friendRequestDto: FriendRequestDto,
    userId: string,
    server: Server,
  ): Promise<void> {
    const { id } = friendRequestDto;

    try {
      const request = await this.friendRequestsService.findById(id);

      if (request.toId !== userId) {
        return;
      }

      const acceptedRequest = await this.friendRequestsService.accept(id);

      acceptedRequest.userIds.forEach((id) => {
        server.to(id).emit(CHAT_EVENTS.acceptFriendRequest, acceptedRequest);
      });
    } catch (error) {}
  }

  async removeConversation(
    conversationDto: ConversationDto,
    server: Server,
  ): Promise<void> {
    const { id: conversationId } = conversationDto;

    try {
      const conversation =
        await this.conversationsService.remove(conversationId);
      conversation.userIds.forEach((id) => {
        server.to(id).emit(CHAT_EVENTS.removeConversation, conversation.id);
      });
      server.in(conversationId).socketsLeave(conversationId);
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
