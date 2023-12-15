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
import { FriendRequestDto } from './dto/friend-request.dto';
import { ConversationDto } from './dto/conversation.dto';
import { CreateGroupDto } from 'src/conversations/dto/create-group.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ValidationPipe, UsePipes, UseFilters } from '@nestjs/common';
import { WsExceptionFilterFilter } from './filters/ws-exception-filter.filter';
import { User } from '@prisma/client';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseFilters(WsExceptionFilterFilter)
@WebSocketGateway()
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private user: User;

  constructor(private readonly chatWsService: ChatWsService) {}

  @SubscribeMessage(CHAT_EVENTS.message)
  async sendMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    sendMessageDto.userId = userId;
    return await this.chatWsService.sendMessage(sendMessageDto, this.server);
  }

  @SubscribeMessage(CHAT_EVENTS.typing)
  async typing(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    typingDto.userId = userId;
    return await this.chatWsService.typing(typingDto, client);
  }

  @SubscribeMessage(CHAT_EVENTS.typingOff)
  async typingOff(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    typingDto.userId = userId;
    return await this.chatWsService.typingOff(typingDto, client);
  }

  @SubscribeMessage(CHAT_EVENTS.friendRequest)
  async friendRequest(
    @MessageBody() friendRequestDto: FriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    friendRequestDto.userId = userId;
    return await this.chatWsService.friendRequest(friendRequestDto, client);
  }

  @SubscribeMessage(CHAT_EVENTS.acceptFriendRequest)
  async acceptFriendRequest(
    @MessageBody() friendRequestDto: FriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    friendRequestDto.userId = userId;
    return await this.chatWsService.acceptFriendRequest(
      friendRequestDto,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.removeFriendRequest)
  async removeFriendRequest(
    @MessageBody() friendRequestDto: FriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    friendRequestDto.userId = userId;
    return await this.chatWsService.removeFriendRequest(
      friendRequestDto,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.removeConversation)
  async removeConversation(
    @MessageBody() conversationDto: ConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    conversationDto.userId = userId;
    return await this.chatWsService.removeConversation(
      conversationDto,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.updateMessage)
  async updateMessage(
    @MessageBody() updateMessageDto: UpdateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    updateMessageDto.userId = userId;
    return await this.chatWsService.updateMessage(
      updateMessageDto,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.deleteMessage)
  async deleteMessage(
    @MessageBody() deleteMessageDto: DeleteMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    deleteMessageDto.userId = userId;
    return await this.chatWsService.deleteMessage(
      deleteMessageDto,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.createGroup)
  async createGroup(
    @MessageBody() createGroupDto: CreateGroupDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    createGroupDto.creatorId = userId;
    return await this.chatWsService.createGroup(createGroupDto, this.server);
  }

  @SubscribeMessage(CHAT_EVENTS.openChat)
  async openChat(
    @MessageBody() conversationDto: ConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    conversationDto.userId = userId;
    return this.chatWsService.openChat(conversationDto);
  }

  @SubscribeMessage(CHAT_EVENTS.exitGroup)
  async exitGroup(
    @MessageBody() conversationDto: ConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    conversationDto.userId = userId;
    return this.chatWsService.exitGroup(conversationDto);
  }

  async handleConnection(client: Socket) {
    return await this.chatWsService.connectUser(client, this.user);
  }

  async handleDisconnect(client: Socket) {
    return await this.chatWsService.disconnectUser(client, this.user);
  }

  async afterInit(client: Socket) {
    // Protect route with JWT cookie auth
    client.use(async (client: any, next: any) => {
      try {
        await this.chatWsService.getUserIdAuth(client);
      } catch (err) {
        next(err);
      }

      next();
    });
  }
}
