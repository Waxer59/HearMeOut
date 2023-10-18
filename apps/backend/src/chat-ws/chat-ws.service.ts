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
import { CreateGroupDto } from 'src/conversations/dto/create-group.dto';

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
    try {
      await this.usersService.setIsOnline(user?.id, true);
    } catch (error) {
      client.disconnect();
      return;
    }

    // Join user to conversation rooms
    client.join(user?.id);

    user?.conversationIds.forEach((conversationId) => {
      client.join(conversationId);
      client.broadcast
        .to(user?.conversationIds)
        .emit(CHAT_EVENTS.userConnect, user?.id);
    });
  }

  async userOffline(client: Socket, user: User): Promise<void> {
    try {
      await this.usersService.setIsOnline(user?.id, false);
    } catch (error) {
      client.disconnect();
      return;
    }

    user?.conversationIds.forEach((conversationId) => {
      client.join(conversationId);
      client.broadcast
        .to(conversationId)
        .emit(CHAT_EVENTS.userDisconnect, user?.id);
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
      client.emit(CHAT_EVENTS.friendRequestOutgoing, request);
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
        const users = acceptedRequest.users.filter((el) => el.id !== id);

        server
          .to(id)
          .emit(CHAT_EVENTS.acceptFriendRequest, { ...acceptedRequest, users });
      });
    } catch (error) {}
  }

  async removeFriendRequest(
    friendRequestDto: FriendRequestDto,
    userId: string,
    server: Server,
  ): Promise<void> {
    const { id } = friendRequestDto;

    try {
      const request = await this.friendRequestsService.findById(id);

      if (request.toId !== userId && request.fromId !== userId) {
        return;
      }

      await this.friendRequestsService.delete(id);
      server.to(request.toId).emit(CHAT_EVENTS.removeFriendRequest, id);
    } catch (error) {}
  }

  // TODO: FIX REMOVE RELATION ON DELETE
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

  async createGroup(
    createGroupDto: CreateGroupDto,
    userId: string,
    server: Server,
  ): Promise<void> {
    try {
      createGroupDto.userIds.push(userId);
      const group = await this.conversationsService.createGroup(createGroupDto);

      createGroupDto.userIds.forEach(async (el) => {
        server.in(el).socketsJoin(group.id);
        await this.usersService.addActiveConversation(el, group.id);
      });

      server.to(group.id).emit(CHAT_EVENTS.createGroup, group);
    } catch (error) {}
  }
}
