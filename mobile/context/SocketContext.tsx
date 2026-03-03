import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Get socket URL from app config and normalize for socket.io root endpoint.
const getSocketUrl = () => {
  const rawConfigUrl =
    Constants.expoConfig?.extra?.socketUrl ||
    Constants.expoConfig?.extra?.apiUrl;

  if (rawConfigUrl) {
    let configUrl = rawConfigUrl.trim().replace(/\/$/, '');
    if (configUrl.endsWith('/api')) {
      configUrl = configUrl.slice(0, -4);
    }

    if (Platform.OS === 'android' && configUrl.includes('localhost')) {
      return configUrl.replace('localhost', '10.0.2.2');
    }
    return configUrl;
  }

  // Fallback defaults
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
};

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem('auth_token')
      .then(value => {
        if (active) setToken(value);
      })
      .catch(console.error);
    return () => {
      active = false;
    };
  }, [user]);

  const socketUrl = useMemo(() => getSocketUrl(), []);

  useEffect(() => {
    let consecutiveErrors = 0;
    const options: any = {
      // Keep polling first for mobile/proxy compatibility; socket.io can still upgrade.
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
      console.log('Socket connected:', newSocket.id, 'URL:', socketUrl);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      consecutiveErrors += 1;
      const message = (error as any)?.message || String(error);
      if (consecutiveErrors <= 2) {
        console.warn('Socket transient error:', message, 'URL:', socketUrl);
      } else {
        console.error('Socket connection error:', error, 'URL:', socketUrl);
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

  const value = {
    socket,
    isConnected,
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
