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
import { ValidationPipe, UsePipes, UseFilters } from '@nestjs/common';
import { WsExceptionFilterFilter } from './filters/ws-exception-filter.filter';
import { ConversationActionsDto } from 'src/conversations/dto/conversation-actions.dto';
import { CreateGroupDto } from 'src/conversations/dto/create-group.dto';
import { JoinGroupDto } from 'src/conversations/dto/join-group.dto';
import { UpdateGroupDTO } from 'src/conversations/dto/update-group.dto';
import { AcceptFriendRequestDto } from 'src/friend-requests/dto/accept-friend-request.dto';
import { CreateFriendRequestDto } from 'src/friend-requests/dto/create-friend-request.dto';
import { RemoveFriendRequestDto } from 'src/friend-requests/dto/remove-friend-request.dto';
import { DeleteMessageDto } from 'src/messages/dto/delete-message.dto';
import { UpdateMessageDto } from 'src/messages/dto/update-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { TypingDto } from './dto/typing.dto';
import { RTCSessionDescription, RTCIceCandidate } from 'wrtc';
import { OfferDto } from 'src/webrtc/dto/offer.dto';
import { CandidateDto } from 'src/webrtc/dto/candidate.dto';

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

  @SubscribeMessage(CHAT_EVENTS.joinGroup)
  async joinGroup(
    @MessageBody() joinGroupDto: JoinGroupDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.joinGroup(
      joinGroupDto,
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
    @MessageBody() createFriendRequestDto: CreateFriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.friendRequest(
      createFriendRequestDto,
      client,
      userId,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.acceptFriendRequest)
  async acceptFriendRequest(
    @MessageBody() acceptFriendRequestDto: AcceptFriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.acceptFriendRequest(
      acceptFriendRequestDto,
      this.server,
      userId,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.removeFriendRequest)
  async removeFriendRequest(
    @MessageBody() removeFriendRequestDto: RemoveFriendRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.removeFriendRequest(
      removeFriendRequestDto,
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

  @SubscribeMessage(CHAT_EVENTS.deleteAccount)
  async deleteAccount(@ConnectedSocket() client: Socket) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.deleteAccount(userId, this.server);
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
    return this.chatWsService.exitGroup(
      conversationActionsDto,
      userId,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.offer)
  async offer(
    @MessageBody() offerDto: OfferDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { offer, conversationId } = offerDto;

    const parsedOffer = JSON.parse(offer) as RTCSessionDescriptionInit;
    const offerObject = new RTCSessionDescription(parsedOffer);

    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.offer(
      offerObject,
      userId,
      conversationId,
      this.server,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.candidate)
  async candidate(
    @MessageBody() candidateDto: CandidateDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId, candidate } = candidateDto;

    const parsedCandidate = JSON.parse(candidate) as RTCIceCandidateInit;
    const candidateObject = new RTCIceCandidate(parsedCandidate);

    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.candidate(
      candidateObject,
      userId,
      conversationId,
    );
  }

  @SubscribeMessage(CHAT_EVENTS.endCall)
  async endCall(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: userId } = await this.chatWsService.getUserIdAuth(client);
    return await this.chatWsService.endCall(conversationId, userId);
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
