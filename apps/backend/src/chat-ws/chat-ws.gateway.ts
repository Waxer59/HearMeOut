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
    @MessageBody() { toId }: FriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.friendRequest(userId, toId, client);
  }

  @SubscribeMessage(CHAT_EVENTS.acceptFriendRequest)
  async acceptFriendRequest(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.acceptFriendRequest(id, userId, client);
  }

  async handleConnection(client: Socket) {
    const user = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.userOnline(client, user);
  }

  async handleDisconnect(client: Socket) {
    const id = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.userOffline(client, id);
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
