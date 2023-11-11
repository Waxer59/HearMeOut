import { Injectable } from '@nestjs/common';
import {
  AUTH_COOKIE,
  CACHE_PREFIXES,
  CHAT_EVENTS,
} from 'src/common/constants/constants';
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
import { CachingService } from 'src/caching/caching.service';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class ChatWsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly messageService: MessagesService,
    private readonly friendRequestsService: FriendRequestsService,
    private readonly conversationsService: ConversationsService,
    private readonly cachingService: CachingService,
  ) {}

  async connectUser(client: Socket, user: User): Promise<void> {
    try {
      await this.usersService.setIsOnline(user?.id, true);
    } catch (error) {
      this.disconnectUser(client, user);
      return;
    }

    // Join user to conversation rooms
    client.join(user?.id);

    // Join user to conversation rooms
    user?.conversationIds.forEach((conversationId) => {
      client.join(conversationId);
    });

    // Notify conversation rooms that the user is online
    client.to(user?.conversationIds).emit(CHAT_EVENTS.userConnect, user?.id);
  }

  async disconnectUser(client: Socket, user: User): Promise<void> {
    try {
      await this.usersService.setIsOnline(user?.id, false);
    } catch (error) {
      client.disconnect();
      return;
    }

    await this.cachingService.deleteCacheKey(
      CACHE_PREFIXES.usersActiveChat + user.id,
    );

    // Notify conversation rooms that the user is offline
    client.broadcast
      .to(user?.conversationIds)
      .emit(CHAT_EVENTS.userDisconnect, user?.id);
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

        server.in(id).socketsJoin(acceptedRequest.id);
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

  async removeConversation(
    conversationDto: ConversationDto,
    server: Server,
  ): Promise<void> {
    const { id: conversationId } = conversationDto;

    try {
      const deletedConversation =
        await this.conversationsService.remove(conversationId);

      const conversationUsers = deletedConversation.userIds.map((userId) =>
        this.usersService.removeConversation(userId, conversationId),
      );

      await Promise.all(conversationUsers);

      deletedConversation.userIds.forEach((id) => {
        server.to(id).emit(CHAT_EVENTS.removeConversation, conversationId);
      });

      server.in(conversationId).socketsLeave(conversationId);
    } catch (error) {}
  }

  async openChat(conversationDto: ConversationDto, userId: string) {
    const { id: conversationId } = conversationDto;
    this.cachingService.setCacheKey(
      CACHE_PREFIXES.usersActiveChat + userId,
      conversationId,
    );

    return this.conversationsService.markAsRead(conversationId, userId);
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

  async updateMessage(
    updateMessageDto: UpdateMessageDto,
    userId: string,
    server: Server,
  ): Promise<void> {
    const { messageId, content } = updateMessageDto;
    try {
      const msg = await this.messageService.findOneById(messageId);

      if (msg.fromId !== userId) {
        return;
      }

      await this.messageService.updateById(messageId, content);
      server.to(msg.toId).emit(CHAT_EVENTS.updateMessage, {
        messageId,
        conversationId: msg.toId,
        content,
      });
    } catch (e) {}
  }

  async deleteMessage(
    deleteMessageDto: DeleteMessageDto,
    userId: string,
    server: Server,
  ): Promise<void> {
    const { messageId } = deleteMessageDto;
    try {
      const msg = await this.messageService.findOneById(messageId);

      if (msg.fromId !== userId) {
        return;
      }

      await this.messageService.deleteById(messageId);
      server.to(msg.toId).emit(CHAT_EVENTS.deleteMessage, {
        messageId,
        conversationId: msg.toId,
      });
    } catch (error) {}
  }
}
