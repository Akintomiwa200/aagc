'use client';

import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  joinLivestream: (streamId: string) => void;
  leaveLivestream: (streamId: string) => void;
  sendLivestreamChat: (streamId: string, message: string, userName: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('admin_token');
      const userToken = localStorage.getItem('auth_token');
      setToken(adminToken || userToken);
    }
  }, []);

  const socketUrl = useMemo(() => SOCKET_URL, []);

  useEffect(() => {
    let consecutiveErrors = 0;
    const options: any = {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 20,
      timeout: 15000,
      withCredentials: true,
    };

    if (token) {
      options.auth = { token };
    }

    const newSocket = io(socketUrl, options);

    newSocket.on('connect', () => {
      consecutiveErrors = 0;
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      consecutiveErrors += 1;
      if (consecutiveErrors <= 2) {
        console.warn('Socket transient error:', error.message);
      } else {
        console.error('Socket connection error:', error);
      }
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, socketUrl]);

  const joinRoom = (room: string) => {
    if (socket && isConnected) {
      socket.emit('join-room', room);
    }
  };

  const leaveRoom = (room: string) => {
    if (socket && isConnected) {
      socket.emit('leave-room', room);
    }
  };

  const joinLivestream = (streamId: string) => {
    if (socket && isConnected) {
      socket.emit('livestream-join', { streamId });
    }
  };

  const leaveLivestream = (streamId: string) => {
    if (socket && isConnected) {
      socket.emit('livestream-leave', { streamId });
    }
  };

  const sendLivestreamChat = (streamId: string, message: string, userName: string) => {
    if (socket && isConnected) {
      socket.emit('livestream-chat', { streamId, message, userName });
    }
  };

  const value = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    joinLivestream,
    leaveLivestream,
    sendLivestreamChat,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
