import { useCallback, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { getEnvVariables } from '../../helpers/getEnvVariables';

export const useSocketChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocketChat = useCallback(() => {
    const socketTmp = io(`${getEnvVariables().VITE_HEARMEOUT_API}`, {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: true,
      forceNew: true
    });
    setSocket(socketTmp);
  }, []);

  const disconnectSocketChat = useCallback(() => {
    socket?.disconnect();
    setSocket(null);
  }, []);

  useEffect(() => {
    socket?.on('userConnect', (payload) => {
      console.log(payload);
    });
  }, [socket]);

  return {
    socket,
    connectSocketChat,
    disconnectSocketChat
  };
};
