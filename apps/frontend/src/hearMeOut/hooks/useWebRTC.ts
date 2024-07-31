const constrains = {
  video: true,
  audio: true
};

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ],
  iceCandidatePoolSize: 10
};

export const useWebRTC = () => {
  const getMedia = async () => {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(constrains);
    } catch (error) {
      console.log(error);
    }

    return stream;
  };

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(servers);
    return peerConnection;
  };

  return {
    getMedia,
    createPeerConnection
  };
};
