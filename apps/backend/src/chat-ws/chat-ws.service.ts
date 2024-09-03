import { Injectable } from '@nestjs/common';
import { AUTH_COOKIE, CACHE_PREFIXES } from 'src/common/constants/constants';
import { CHAT_EVENTS } from 'ws-types';
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
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { parseCookies } from 'src/common/helpers/parseCookies';
import { WebrtcService } from 'src/webrtc/webrtc.service';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'wrtc';

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

@Injectable()
export class ChatWsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly messageService: MessagesService,
    private readonly friendRequestsService: FriendRequestsService,
    private readonly conversationsService: ConversationsService,
    private readonly cachingService: CachingService,
    private readonly configService: ConfigService,
    private readonly webRtcService: WebrtcService,
  ) {}

  async sendMessage(
    sendMessageDto: SendMessageDto,
    senderId: string,
    server: Server,
  ): Promise<void> {
    const { conversation, ...message } = await this.messageService.create({
      ...sendMessageDto,
      fromId: senderId,
    });

    conversation.userIds.forEach(async (userId) => {
      const currentUserActiveConversation =
        await this.cachingService.getCacheKey(
          CACHE_PREFIXES.userActiveChat + userId,
        );

      // If the user is not in the current conversation
      // then notify the user that the message was sent
      if (
        currentUserActiveConversation !== sendMessageDto.conversationId &&
        senderId !== userId
      ) {
        // Notify user that a message was sent
        server.to(userId).emit(CHAT_EVENTS.notification, {
          id: sendMessageDto.conversationId,
        });
        await this.usersService.addConversationNotification(
          userId,
          sendMessageDto.conversationId,
        );
      }
    });

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

  async deleteAccount(userId: string, server: Server): Promise<void> {
    const { incominReqs, outgoingReqs } =
      await this.friendRequestsService.findAllUserReq(userId);
    const deletedUser = await this.usersService.remove(userId);

    // Exit conversations
    deletedUser.conversationIds.forEach(async (conversationId) => {
      // Leave socket
      server.in(userId).socketsLeave(conversationId);

      const conversation =
        await this.conversationsService.findById(conversationId);

      if (conversation.type === CONVERSATION_TYPE.group) {
        await this.exitGroup({ id: conversationId }, userId, server);
      } else {
        await this.removeConversation({ id: conversationId }, server, userId);
      }
    });

    // Notify friend request users
    incominReqs.forEach(({ id, fromId }) => {
      server
        .to(fromId)
        .emit(CHAT_EVENTS.removeFriendRequest, { id, isOutgoing: true });
    });

    outgoingReqs.forEach(({ id, toId }) => {
      server
        .to(toId)
        .emit(CHAT_EVENTS.removeFriendRequest, { id, isOutgoing: false });
    });

    server.to(userId).emit(CHAT_EVENTS.deleteAccount);
  }

  async openChat(
    conversationActionsDto: ConversationActionsDto,
    userId: string,
  ): Promise<void> {
    const { id: conversationId } = conversationActionsDto;

    await this.cachingService.setCacheKey(
      CACHE_PREFIXES.userActiveChat + userId,
      conversationId,
    );

    await this.usersService.removeConversationNotification(
      userId,
      conversationId,
    );
  }

  async getUserIdAuth(client: Socket): Promise<User> {
    const cookies = parseCookies(client.handshake.headers.cookie);
    const authCookie = cookies?.[AUTH_COOKIE];

    if (!authCookie) {
      client.disconnect();
      return;
    }

    const token = cookieParser.signedCookie(
      decodeURIComponent(authCookie),
      this.configService.get('COOKIE_SECRET'),
    );

    if (!token) {
      client.disconnect();
      return;
    }

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

    server.to(group.id).emit(CHAT_EVENTS.newConversation, group);
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

    const currentGroup =
      await this.conversationsService.findById(conversationId);
    const haveAdminsLeft = currentGroup?.adminIds.length > 1;
    const filteredUsers = currentGroup.userIds.filter((el) => el !== userId);
    const newAdmin = [];

    // If the group have no users delete it
    if (filteredUsers.length === 0) {
      this.removeConversation(conversationActionsDto, server, userId);
      return;
    }

    // If the group have no admins, assign one
    if (!haveAdminsLeft) {
      newAdmin.push(filteredUsers[0]);
    }

    const newGroup = await this.conversationsService.updateGroup({
      id: conversationId,
      kickUsers: [userId],
      makeAdmins: newAdmin,
    });

    // Leave socket room
    server.in(userId).socketsLeave(conversationId);

    // Notify user that has left the group
    server.to(userId).emit(CHAT_EVENTS.removeConversation, conversationId);

    // Send group update
    server.to(conversationId).emit(CHAT_EVENTS.updateGroup, newGroup);
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

  async connectUser(client: Socket, user: User): Promise<void> {
    if (!user) {
      client.disconnect();
      return;
    }

    const { id, conversationIds } = user;
    await this.usersService.setIsOnline(id, true);

    const connectedClients = +(await this.cachingService.getCacheKey(
      CACHE_PREFIXES.connectedClients + id,
    ));

    await this.cachingService.setCacheKey(
      CACHE_PREFIXES.connectedClients + id,
      connectedClients + 1,
    );

    // Join user to conversation rooms
    client.join([id, ...conversationIds]);

    // Notify conversation rooms that the user is online
    client.to(conversationIds).emit(CHAT_EVENTS.userConnect, id);
  }

  async disconnectUser(client: Socket, user: User): Promise<void> {
    if (!user) {
      client.disconnect();
      return;
    }
    const { id, conversationIds } = user;

    const connectedClients = +(await this.cachingService.getCacheKey(
      CACHE_PREFIXES.connectedClients + id,
    ));

    // A user can have multiple tabs
    // if the user have multiple tabs
    // then decrement the connected clients count
    // else delete the connected clients count from cache
    // and set the user as offline in the database.
    if (connectedClients > 1) {
      await this.cachingService.setCacheKey(
        CACHE_PREFIXES.connectedClients + id,
        `${connectedClients - 1}`,
      );
      return;
    }

    await this.cachingService.deleteCacheKey(
      CACHE_PREFIXES.connectedClients + id,
    );
    await this.usersService.setIsOnline(id, false);

    // Delete active chat from cache
    await this.cachingService.deleteCacheKey(
      CACHE_PREFIXES.userActiveChat + id,
    );

    // Notify conversation rooms that the user is offline
    client.broadcast.to(conversationIds).emit(CHAT_EVENTS.userDisconnect, id);
  }

  async offer(
    offer: RTCSessionDescription,
    userId: string,
    conversationId: string,
    server: Server,
  ): Promise<void> {
    const answer = await this.addPeerToConversation(
      conversationId,
      userId,
      offer,
      server,
    );

    // Give answer to the client
    server.to(userId).emit(CHAT_EVENTS.answer, JSON.stringify(answer));
  }

  async candidate(
    candidate: RTCIceCandidate,
    userId: string,
    conversationId: string,
  ): Promise<void> {
    await this.addIceCandidateToConversation(conversationId, userId, candidate);
  }

  private peers: { [key: string]: RTCPeerConnection } = {};
  private peerTracks = {};

  // constructor(private readonly cachingService: CachingService) {}

  async addPeerToConversation(
    conversationId: string,
    peerId: string,
    offer: RTCSessionDescription,
    server: Server,
  ): Promise<RTCSessionDescription> {
    // const peers = await this.getConversationPeers(conversationId);
    const peers = this.peers[conversationId];
    const peerConnection = new RTCPeerConnection(servers);

    if (!peers) {
      this.peers[conversationId] = {};
    }

    this.peers[conversationId][peerId] = peerConnection;

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      const tracks = remoteStream.getTracks();
      const peers = this.peers[conversationId];

      if (!this.peerTracks[conversationId]) {
        this.peerTracks[conversationId] = {};
      }

      // Save the new tracks for the peer
      this.peerTracks[conversationId][peerId] = tracks;
      const conversationTracks = this.peerTracks[conversationId];

      Object.keys(peers).forEach((userId) => {
        const peer = peers[userId];

        // If the peer is the new peer (peerId), add all tracks of other peers
        if (userId === peerId) {
          Object.keys(conversationTracks).forEach((otherPeerId) => {
            if (otherPeerId !== peerId) {
              // Excluir las pistas propias
              const otherPeerTracks = conversationTracks[otherPeerId];
              otherPeerTracks.forEach((track) => {
                peer.addTrack(track, remoteStream);
              });
            }
          });
        } else {
          // If the peer is not the new peer (peerId), add the tracks of the new peer (peerId)
          tracks.forEach((track) => {
            if (!peer.getSenders().some((sender) => sender.track === track)) {
              peer.addTrack(track, remoteStream);
            }
          });
        }
      });
    };

    peerConnection.onnegotiationneeded = async () => {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      server.to(peerId).emit(CHAT_EVENTS.offer, offer);
    };

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        server.to(peerId).emit(CHAT_EVENTS.candidate, candidate);
      }
    };

    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // const peerState = {
    //   remoteDescription: offer,
    //   localDescription: answer,
    //   // Track ICE candidates
    //   iceCandidates: [],
    // };

    return answer;
  }

  async endCall(conversationId: string, peerId: string): Promise<void> {
    const peer = this.peers[conversationId]?.[peerId];

    if (peer) {
      // Remove all local tracks
      peer.getSenders().forEach((sender) => sender?.track?.stop());

      // Remove all remote tracks
      peer.getReceivers().forEach((receiver) => receiver?.track?.stop());

      // Close peer connection
      peer.close();

      // Remove peer from conversation
      delete this.peers[conversationId][peerId];
    }

    // If there are no more peers in the conversation
    if (
      this.peers[conversationId] &&
      Object.keys(this.peers[conversationId]).length === 0
    ) {
      delete this.peers[conversationId];
    }
  }

  async addIceCandidateToConversation(
    conversationId: string,
    peerId: string,
    candidate: RTCIceCandidate,
  ): Promise<void> {
    // const peers = await this.getConversationPeers(conversationId);
    const peer = this.peers[conversationId][peerId];

    if (peer) {
      await peer.addIceCandidate(candidate);
    }
  }

  async getConversationPeer(
    conversationId: string,
    peerId: string,
  ): Promise<RTCPeerConnection | null> {
    const peerState = this.peers[conversationId][peerId];
    if (!peerState) {
      return null;
    }
    console.log(peerState);
    return peerState;

    const peerConnection = new RTCPeerConnection(servers);

    await peerConnection.setRemoteDescription(peerState.remoteDescription);
    await peerConnection.setLocalDescription(peerState.localDescription);

    // Add ICE candidates
    peerState.iceCandidates.forEach((candidate) => {
      peerConnection.addIceCandidate(candidate);
    });

    return peerConnection;
  }

  async getConversationPeers(
    conversationId: string,
  ): Promise<{ [key: string]: RTCPeerConnection }> {
    // const peersRaw = await this.cachingService.getCacheKey(
    //   CACHE_PREFIXES.webrtcPeers + conversationId,
    // );

    // const peers: { [key: string]: RTCPeerConnection } = {};

    return this.peers[conversationId];
  }
}
