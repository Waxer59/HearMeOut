import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import type { Server, Socket } from 'socket.io';
import { CHAT_EVENTS } from 'ws-types';
import { SendMessageDto } from './dto/send-message.dto';
import { TypingDto } from './dto/typing.dto';
import { FriendRequestDto } from '../friend-requests/dto/friend-request.dto';
import { CreateGroupDto } from 'src/conversations/dto/create-group.dto';
import { DeleteMessageDto } from '../messages/dto/delete-message.dto';
import { UpdateMessageDto } from '../messages/dto/update-message.dto';
import { ValidationPipe, UsePipes, UseFilters } from '@nestjs/common';
import { WsExceptionFilterFilter } from './filters/ws-exception-filter.filter';
import { ConversationActionsDto } from '../conversations/dto/conversation-actions.dto';
import { UpdateGroupDTO } from 'src/conversations/dto/update-group.dto';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseFilters(WsExceptionFilterFilter)
@WebSocketGateway()
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatWsService: ChatWsService) {}

  @SubscribeMessage(CHAT_EVENTS.message)
  async sendMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.sendMessage(
      sendMessageDto,
      userId,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.typing)
  async typing(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.typing(typingDto, client, userId);
  }

  @SubscribeMessage(CHAT_EVENTS.typingOff)
  async typingOff(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.typingOff(typingDto, client, userId);
  }

  @SubscribeMessage(CHAT_EVENTS.friendRequest)
  async friendRequest(
    @MessageBody() friendRequestDto: FriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.friendRequest(
      friendRequestDto,
      client,
      userId,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.acceptFriendRequest)
  async acceptFriendRequest(
    @MessageBody() friendRequestDto: FriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.acceptFriendRequest(
      friendRequestDto,
      this.server,
      userId,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.removeFriendRequest)
  async removeFriendRequest(
    @MessageBody() friendRequestDto: FriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.removeFriendRequest(
      friendRequestDto,
      this.server,
      userId,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.updateGroup)
  async updateGroup(
    @MessageBody() updateGroupDto: UpdateGroupDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.updateGroup(
      updateGroupDto,
      userId,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.removeConversation)
  async removeConversation(
    @MessageBody() conversationActionsDto: ConversationActionsDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.removeConversation(
      conversationActionsDto,
      this.server,
      userId,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.updateMessage)
  async updateMessage(
    @MessageBody() updateMessageDto: UpdateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.updateMessage(
      updateMessageDto,
      this.server,
      userId,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.deleteMessage)
  async deleteMessage(
    @MessageBody() deleteMessageDto: DeleteMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.deleteMessage(
      deleteMessageDto,
      this.server,
      userId,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.createGroup)
  async createGroup(
    @MessageBody() createGroupDto: CreateGroupDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.createGroup(
      createGroupDto,
      this.server,
      userId,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.openChat)
  async openChat(
    @MessageBody() conversationActionsDto: ConversationActionsDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return this.chatWsService.openChat(conversationActionsDto, userId);
  }

  @SubscribeMessage(CHAT_EVENTS.exitGroup)
  async exitGroup(
    @MessageBody() conversationActionsDto: ConversationActionsDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return this.chatWsService.exitGroup(conversationActionsDto, userId);
  }

  async handleConnection(client: Socket) {
    const user = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.connectUser(client, user);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.disconnectUser(client, user);
  }

  async afterInit(client: Socket) {
    // Protect route with JWT cookie auth
    client.use(async (client: any, next: any) => {
      const user = await this.chatWsService.getUserIdAuth(client);

      if (!user) {
        next(new Error('Unauthorized'));
      }

      next();
    });
  }
}
