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
import { CHAT_EVENTS } from 'src/common/constants/constants';
import { SendMessageDto } from './dto/send-message.dto';
import { TypingDto } from './dto/typing.dto';
import { FriendRequestDto } from './dto/friend-request.dto';
import { ConversationDto } from './dto/conversation.dto';
import { CreateGroupDto } from 'src/conversations/dto/create-group.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@WebSocketGateway()
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatWsService: ChatWsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(CHAT_EVENTS.message)
  async sendMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.sendMessage(
      userId,
      sendMessageDto,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.typing)
  async typing(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.typing(typingDto, userId, client);
  }

  @SubscribeMessage(CHAT_EVENTS.typingOff)
  async typingOff(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.typingOff(typingDto, userId, client);
  }

  @SubscribeMessage(CHAT_EVENTS.friendRequest)
  async friendRequest(
    @MessageBody() friendRequestDto: FriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.friendRequest(
      userId,
      friendRequestDto,
      client,
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
      userId,
      this.server,
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
      userId,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.removeConversation)
  async removeConversation(@MessageBody() conversationDto: ConversationDto) {
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
    return await this.chatWsService.updateMessage(
      updateMessageDto,
      userId,
      this.server,
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
      userId,
      this.server,
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
      userId,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.openChat)
  async openChat(
    @MessageBody() conversationDto: ConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return this.chatWsService.openChat(conversationDto, userId);
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
      try {
        await this.chatWsService.getUserIdAuth(client);
      } catch (err) {
        next(err);
      }

      next();
    });
  }
}
