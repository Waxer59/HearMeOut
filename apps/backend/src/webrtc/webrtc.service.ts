import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { CachingService } from 'src/caching/caching.service';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'wrtc';
import { CHAT_EVENTS } from 'ws-types';

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

@Injectable()
export class WebrtcService {
  private peers: { [key: string]: RTCPeerConnection } = {};
  private peerTracks = {};

  constructor(private readonly cachingService: CachingService) {}

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
