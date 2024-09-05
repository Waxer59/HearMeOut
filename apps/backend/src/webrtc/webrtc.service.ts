import { Injectable } from '@nestjs/common';
import type { Socket } from 'socket.io';
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

  async addPeerToConversation(
    conversationId: string,
    peerId: string,
    offer: RTCSessionDescription,
    client: Socket,
  ): Promise<RTCSessionDescription> {
    const peers = await this.getConversationPeers(conversationId);
    const peerConnection = new RTCPeerConnection(servers);
    await this.savePeer(conversationId, peerId, peerConnection);

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      const tracks = remoteStream.getTracks();

      if (!peers) {
        return;
      }

      Object.keys(peers).forEach((userId) => {
        const peer = peers[userId];

        // If the peer is the new peer, add all tracks of other peers
        if (userId === peerId) {
          Object.keys(peers).forEach(async (otherPeerId) => {
            const otherPeer = peers[otherPeerId];
            const peerTracks = otherPeer
              .getReceivers()
              .map((sender) => sender.track);

            if (otherPeerId !== peerId) {
              peerTracks.forEach((track) => {
                peer.addTrack(track, remoteStream);
              });
            }
          });
        } else {
          // If the peer is not the new peer, add the tracks of the new peer
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
      client.emit(CHAT_EVENTS.offer, offer);
    };

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        client.emit(CHAT_EVENTS.candidate, candidate);
      }
    };

    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    return answer;
  }

  async endPeerCall(conversationId: string, peerId: string): Promise<void> {
    const peer = await this.getConversationPeer(conversationId, peerId);

    if (peer) {
      // Remove all local tracks
      peer.getSenders().forEach((sender) => sender?.track?.stop());

      // Remove all remote tracks
      peer.getReceivers().forEach((receiver) => receiver?.track?.stop());

      // Close peer connection
      peer.close();

      // Remove peer from conversation
      await this.removePeerFromConversation(conversationId, peerId);
    }
  }

  async addIceCandidateToConversation(
    conversationId: string,
    peerId: string,
    candidate: RTCIceCandidate,
  ): Promise<void> {
    const peer = await this.getConversationPeer(conversationId, peerId);

    if (peer) {
      await peer.addIceCandidate(candidate);
    }
  }

  async getConversationPeer(
    conversationId: string,
    peerId: string,
  ): Promise<RTCPeerConnection | null> {
    const peer = this.peers[conversationId]?.[peerId];

    return peer;
  }

  async savePeer(
    conversationId: string,
    peerId: string,
    peer: RTCPeerConnection,
  ): Promise<void> {
    if (!this.peers[conversationId]) {
      this.peers[conversationId] = {};
    }

    this.peers[conversationId][peerId] = peer;
  }

  async findPeerConversation(peerId: string): Promise<string | null> {
    const conversationIds = Object.keys(this.peers).filter(
      (id) => this.peers[id][peerId],
    );

    if (conversationIds.length === 0) {
      return null;
    }

    return conversationIds[0];
  }

  async removePeer(peerId: string): Promise<void> {
    const conversationId = await this.findPeerConversation(peerId);

    if (!conversationId) {
      return;
    }

    // Delete all tracks of the peer
    await this.endPeerCall(conversationId, peerId);
  }

  async removePeerFromConversation(
    conversationId: string,
    peerId: string,
  ): Promise<RTCPeerConnection> {
    const peer = this.peers[conversationId][peerId];

    delete this.peers[conversationId][peerId];

    return peer;
  }

  async getConversationPeers(
    conversationId: string,
  ): Promise<RTCPeerConnection[] | null> {
    const peers = this.peers[conversationId];

    return peers;
  }

  async removeConversationPeers(
    conversationId: string,
  ): Promise<{ [key: string]: RTCPeerConnection }> {
    const peers = this.peers[conversationId];
    delete this.peers[conversationId];
    return peers;
  }
}
