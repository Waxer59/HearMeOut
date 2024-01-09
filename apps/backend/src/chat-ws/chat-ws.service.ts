import { Injectable } from '@nestjs/common';
import { AUTH_COOKIE, CACHE_PREFIXES } from 'src/common/constants/constants';
import { CHAT_EVENTS } from 'ws-types';
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
import { ConversationActionsDto } from '../conversations/dto/conversation-actions.dto';
import { CreateFriendRequestDto } from '../friend-requests/dto/create-friend-request.dto';
import { CreateGroupDto } from 'src/conversations/dto/create-group.dto';
import { CachingService } from 'src/caching/caching.service';
import { DeleteMessageDto } from '../messages/dto/delete-message.dto';
import { UpdateMessageDto } from '../messages/dto/update-message.dto';
import { UpdateGroupDTO } from 'src/conversations/dto/update-group.dto';
import { RemoveFriendRequestDto } from 'src/friend-requests/dto/remove-friend-request.dto';
import { AcceptFriendRequestDto } from 'src/friend-requests/dto/accept-friend-request.dto';
import { CONVERSATION_TYPE } from 'src/common/types/types';
import { JoinGroupDto } from 'src/conversations/dto/join-group.dto';

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

  async sendMessage(
    sendMessageDto: SendMessageDto,
    userId: string,
    server: Server,
  ): Promise<void> {
    const { conversation, ...message } = await this.messageService.create({
      ...sendMessageDto,
      fromId: userId,
    });

    const notifyUserIds = [];
    conversation.userIds.forEach(async (userId) => {
      const currentUserConversation = await this.cachingService.getCacheKey(
        CACHE_PREFIXES.usersActiveChat + userId,
      );

      // If the user is not in the current conversation
      // then notify the user that the message was sent
      if (currentUserConversation !== sendMessageDto.conversationId) {
        notifyUserIds.push(userId);
        await this.usersService.addConversationNotification(
          userId,
          sendMessageDto.conversationId,
        );
      }
    });

    // Notify users that a message was sent
    server
      .to(notifyUserIds)
      .emit(CHAT_EVENTS.notification, { id: sendMessageDto.conversationId });

    server.to(sendMessageDto.conversationId).emit(CHAT_EVENTS.message, message);
  }

  async typing(
    typingDto: TypingDto,
    client: Socket,
    userId: string,
  ): Promise<void> {
    client.broadcast
      .to(typingDto.conversationId)
      .emit(CHAT_EVENTS.typing, { userId, ...typingDto });
  }

  async typingOff(
    typingDto: TypingDto,
    client: Socket,
    userId: string,
  ): Promise<void> {
    client.broadcast
      .to(typingDto.conversationId)
      .emit(CHAT_EVENTS.typingOff, { userId, ...typingDto });
  }

  async friendRequest(
    createFriendRequestDto: CreateFriendRequestDto,
    client: Socket,
    fromId: string,
  ): Promise<void> {
    const { userId } = createFriendRequestDto;
    const request = await this.friendRequestsService.create(fromId, userId);
    client.to(userId).emit(CHAT_EVENTS.friendRequest, request);
    client.emit(CHAT_EVENTS.friendRequestOutgoing, request);
  }

  async acceptFriendRequest(
    acceptFriendRequestDto: AcceptFriendRequestDto,
    server: Server,
    userId: string,
  ): Promise<void> {
    const { id: friendReqId } = acceptFriendRequestDto;

    const { toId } = await this.friendRequestsService.findById(friendReqId);

    // Check if the user who accepts the friend request
    // is the user who was sent the friend request
    if (toId !== userId) {
      return;
    }

    const acceptedRequest =
      await this.friendRequestsService.accept(friendReqId);

    // Join users to conversation room
    server.in(acceptedRequest.userIds).socketsJoin(acceptedRequest.id);

    // Notify users that the friend request was
    // accepted and the conversation room was created
    acceptedRequest.userIds.forEach((userId) => {
      const users = acceptedRequest.users.filter((el) => el.id !== userId);
      server
        .to(userId)
        .emit(CHAT_EVENTS.acceptFriendRequest, { ...acceptedRequest, users });
    });
  }

  async removeFriendRequest(
    removeFriendRequestDto: RemoveFriendRequestDto,
    server: Server,
    userId: string,
  ): Promise<void> {
    const { id, isOutgoing } = removeFriendRequestDto;
    const { toId, fromId } = await this.friendRequestsService.findById(id);
    const notifyUserId = isOutgoing ? toId : fromId;

    // Check if the user who removes the friend request
    // is the user who was sent the friend request or who sent the friend request
    if (toId !== userId && fromId !== userId) {
      return;
    }

    await this.friendRequestsService.delete(id);
    server
      .to(notifyUserId)
      .emit(CHAT_EVENTS.removeFriendRequest, { id, isOutgoing: !isOutgoing });
  }

  async removeConversation(
    conversationActionsDto: ConversationActionsDto,
    server: Server,
    userId: string,
  ): Promise<void> {
    const { id: conversationId } = conversationActionsDto;
    const conversation =
      await this.conversationsService.findById(conversationId);
    const isGroupAdmin = conversation.adminIds.includes(userId);
    const isChatMember = conversation.userIds.includes(userId);
    const isGroupConversation = conversation.type === CONVERSATION_TYPE.group;

    // User must be in the conversation if its a chat
    // User must be an admin if its a group
    if ((!isGroupAdmin && isGroupConversation) || !isChatMember) {
      return;
    }

    const deletedConversation =
      await this.conversationsService.remove(conversationId);

    const conversationUsers = deletedConversation.userIds.map((userId) =>
      this.usersService.removeConversation(userId, conversationId),
    );

    try {
      await Promise.all(conversationUsers);
    } catch (error) {}

    server
      .to(deletedConversation.userIds)
      .emit(CHAT_EVENTS.removeConversation, conversationId);
    server.in(conversationId).socketsLeave(conversationId);
  }

  async openChat(
    conversationActionsDto: ConversationActionsDto,
    userId: string,
  ): Promise<void> {
    const { id: conversationId } = conversationActionsDto;

    this.cachingService.setCacheKey(
      CACHE_PREFIXES.usersActiveChat + userId,
      conversationId,
    );

    await this.usersService.removeConversationNotification(
      userId,
      conversationId,
    );
  }

  async getUserIdAuth(client: Socket): Promise<User> {
    const rawCookies = client.request.headers.cookie;
    const parsedCookies = parseCookies(rawCookies);

    if (!parseCookies) {
      client.disconnect();
      return;
    }

    const token = parsedCookies?.[AUTH_COOKIE];

    try {
      return await this.authService.verify(token);
    } catch (err) {
      client.disconnect();
    }
  }

  async createGroup(
    createGroupDto: CreateGroupDto,
    server: Server,
    creatorId: string,
  ): Promise<void> {
    createGroupDto.userIds.push(creatorId);
    const group = await this.conversationsService.createGroup(
      createGroupDto,
      creatorId,
    );

    // Join users to conversation room & set conversation as active
    createGroupDto.userIds.forEach(async (el) => {
      server.in(el).socketsJoin(group.id);
      await this.usersService.addActiveConversation(el, group.id);
    });

    server.to(group.id).emit(CHAT_EVENTS.createGroup, group);
  }

  async updateGroup(
    updateGroupDto: UpdateGroupDTO,
    userId: string,
    server: Server,
  ) {
    const { id: groupId, kickUsers, addUsers } = updateGroupDto;
    const group = await this.conversationsService.findById(groupId);
    const isGroupAdmin = group.adminIds.includes(userId);

    if (!isGroupAdmin) {
      return;
    }

    const newGroup =
      await this.conversationsService.updateGroup(updateGroupDto);

    // Remove users from conversation room
    if (kickUsers) {
      server.in(kickUsers).socketsLeave(groupId);
      server.to(kickUsers).emit(CHAT_EVENTS.removeConversation, groupId);
    }

    // Add users to conversation room
    if (addUsers) {
      server.in(addUsers).socketsJoin(groupId);
      server.to(addUsers).emit(CHAT_EVENTS.newConversation, newGroup);
    }

    server.in(groupId).emit(CHAT_EVENTS.updateGroup, newGroup);
  }

  async updateMessage(
    updateMessageDto: UpdateMessageDto,
    server: Server,
    userId: string,
  ): Promise<void> {
    const { messageId, content } = updateMessageDto;
    const msg = await this.messageService.findOneById(messageId);

    if (msg.fromId !== userId) {
      return;
    }

    await this.messageService.updateById(messageId, content);
    server.to(msg.conversationId).emit(CHAT_EVENTS.updateMessage, {
      messageId,
      conversationId: msg.conversationId,
      content,
    });
  }

  async exitGroup(
    conversationActionsDto: ConversationActionsDto,
    userId: string,
    server: Server,
  ): Promise<void> {
    const { id: conversationId } = conversationActionsDto;

    const newGroup = await this.conversationsService.updateGroup({
      id: conversationId,
      kickUsers: [userId],
    });

    // Send group update
    server.to(conversationId).emit(CHAT_EVENTS.updateGroup, newGroup);

    // Leave socket room
    server.in(userId).socketsLeave(conversationId);
  }

  async deleteMessage(
    deleteMessageDto: DeleteMessageDto,
    server: Server,
    userId: string,
  ): Promise<void> {
    const { messageId } = deleteMessageDto;
    const msg = await this.messageService.findOneById(messageId);

    if (msg.fromId !== userId) {
      return;
    }

    await this.messageService.deleteById(messageId);
    server.to(msg.conversationId).emit(CHAT_EVENTS.deleteMessage, {
      messageId,
      conversationId: msg.conversationId,
    });
  }

  async connectUser(client: Socket, user: User): Promise<void> {
    try {
      await this.usersService.setIsOnline(user?.id, true);
    } catch (error) {
      this.disconnectUser(client, user);
      return;
    }

    // Join user to conversation rooms
    client.join([user?.id, ...user?.conversationIds]);

    // Notify conversation rooms that the user is online
    client.to(user?.conversationIds).emit(CHAT_EVENTS.userConnect, user?.id);
  }

  async joinGroup(
    joinGroupDto: JoinGroupDto,
    userId: string,
    server: Server,
  ): Promise<void> {
    const { joinCode } = joinGroupDto;
    const conversation = await this.conversationsService.joinGroupWithJoinCode(
      userId,
      joinCode,
    );

    if (!conversation) {
      return;
    }

    // Update group for the users in the group
    server.in(conversation.id).emit(CHAT_EVENTS.updateGroup, conversation);

    // Join user to conversation room
    server.in(userId).socketsJoin(conversation.id);
    server.to(userId).emit(CHAT_EVENTS.newConversation, conversation);
  }

  async disconnectUser(client: Socket, user: User): Promise<void> {
    try {
      await this.usersService.setIsOnline(user?.id, false);
    } catch (error) {
      client.disconnect();
      return;
    }

    // Delete active chat from cache
    await this.cachingService.deleteCacheKey(
      CACHE_PREFIXES.usersActiveChat + user.id,
    );

    // Notify conversation rooms that the user is offline
    client.broadcast
      .to(user?.conversationIds)
      .emit(CHAT_EVENTS.userDisconnect, user?.id);
  }
}
