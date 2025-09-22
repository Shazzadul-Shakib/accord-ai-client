"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  connectSocket: () => {},
  disconnectSocket: () => {},
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const getTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") return null;

  const accessToken = localStorage.getItem("accessToken");
  return accessToken;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const pingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3; // Increased for robustness
  const currentTokenRef = useRef<string | null>(null);
  const isConnectingRef = useRef(false);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const retryTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const cleanupTimeouts = useCallback(() => {
    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current);
      pingTimeoutRef.current = undefined;
    }
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = undefined;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = undefined;
    }
  }, []);

  const cleanupSocket = useCallback((socket: Socket) => {
    try {
      socket.off();
      socket.removeAllListeners();
      if (socket.connected) {
        socket.disconnect();
      }
      socket.close();
      if (socket.io) {
        socket.io.removeAllListeners();
      }
    } catch (error) {
      console.error("Error during socket cleanup:", error);
    }
  }, []);

  const disconnectSocket = useCallback(() => {
    cleanupTimeouts();
    if (socketRef.current) {
      cleanupSocket(socketRef.current);
      socketRef.current = null;
    }
    setSocket(null);
    setIsConnected(false);
    setOnlineUsers([]);
    reconnectAttempts.current = 0;
    currentTokenRef.current = null;
    isConnectingRef.current = false;
  }, [cleanupSocket, cleanupTimeouts]);

  const connectSocket = useCallback(
    (token: string) => {
      if (isConnectingRef.current) {
        return;
      }

      if (currentTokenRef.current === token && socketRef.current?.connected) {
        return;
      }

      isConnectingRef.current = true;
      currentTokenRef.current = token;

      if (socketRef.current) {
        cleanupSocket(socketRef.current);
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }

      cleanupTimeouts();

      connectionTimeoutRef.current = setTimeout(() => {
        if (socketRef.current && !socketRef.current.connected) {
          cleanupSocket(socketRef.current);
          socketRef.current = null;
          setSocket(null);
        }
        isConnectingRef.current = false;
        reconnectAttempts.current++;

        if (reconnectAttempts.current < maxReconnectAttempts) {
          retryTimeoutRef.current = setTimeout(() => {
            connectSocket(token);
          }, 3000);
        } else {
          disconnectSocket();
        }
      }, 15000); // Increased timeout

      try {
        const newSocket = io(
          process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
          {
            auth: { token },
            transports: ["polling", "websocket"], // Default order for reliability
            reconnection: false,
            timeout: 10000,
            forceNew: true,
            autoConnect: true,
          },
        );

        newSocket.on("connect", () => {
          clearTimeout(connectionTimeoutRef.current);
          setIsConnected(true);
          reconnectAttempts.current = 0;
          isConnectingRef.current = false;
        });

        newSocket.on("connect_error", (error) => {
          setIsConnected(false);
          isConnectingRef.current = false;
          clearTimeout(connectionTimeoutRef.current);

          if (
            error.message.includes("Authentication error") ||
            error.message.includes("Unauthorized") ||
            error.message.includes("Invalid token")
          ) {
            disconnectSocket();
          }
        });

        newSocket.on("disconnect", (reason) => {
          setIsConnected(false);
          isConnectingRef.current = false;
          clearTimeout(connectionTimeoutRef.current);

          const shouldReconnect = [
            "ping timeout",
            "transport close",
            "transport error",
          ].includes(reason);

          if (
            shouldReconnect &&
            currentTokenRef.current &&
            reconnectAttempts.current < maxReconnectAttempts
          ) {
            retryTimeoutRef.current = setTimeout(() => {
              connectSocket(currentTokenRef.current!);
            }, 2000);
          } else {
            disconnectSocket();
          }
        });

        newSocket.on("user_status_changed", ({ userId, isOnline }) => {
          setOnlineUsers((prev) =>
            isOnline
              ? [...new Set([...prev, userId])]
              : prev.filter((id) => id !== userId),
          );
        });

        newSocket.on("online_users_updated", ({ onlineUsers: users }) => {
          setOnlineUsers(users);
        });

        newSocket.on("pong", () => {
          if (pingTimeoutRef.current) {
            clearTimeout(pingTimeoutRef.current);
          }
          pingTimeoutRef.current = setTimeout(() => {
            disconnectSocket();
          }, 10000);
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
      } catch (error) {
        console.error("Failed to create socket:", error);
        isConnectingRef.current = false;
        clearTimeout(connectionTimeoutRef.current);
      }
    },
    [disconnectSocket, cleanupSocket, cleanupTimeouts],
  );

  useEffect(() => {
    const token = getTokenFromStorage();
    if (token) {
      connectSocket(token);
    }

    const interval = setInterval(() => {
      const currentToken = getTokenFromStorage();

      if (!isConnectingRef.current) {
        if (currentToken && currentToken !== currentTokenRef.current) {
          connectSocket(currentToken);
        } else if (
          !currentToken &&
          (socketRef.current?.connected || currentTokenRef.current)
        ) {
          disconnectSocket();
        } else if (
          currentToken &&
          !socketRef.current?.connected &&
          currentTokenRef.current === currentToken
        ) {
          connectSocket(currentToken);
        }
      }
    }, 10000); // Increased interval

    return () => {
      clearInterval(interval);
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    connectSocket,
    disconnectSocket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
