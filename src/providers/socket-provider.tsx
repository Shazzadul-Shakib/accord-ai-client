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

const getTokenFromCookies = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "accessToken") {
      return decodeURIComponent(value);
    }
  }
  return null;
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
    console.log("🔌 Disconnecting socket...");
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
        console.log("🔄 Connection already in progress, skipping...");
        return;
      }

      if (currentTokenRef.current === token && socketRef.current?.connected) {
        console.log("✅ Already connected with same token");
        return;
      }

      console.log("🔌 Connecting socket with new token...", token);
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
        console.log("⏰ Connection timeout reached, aborting...");
        if (socketRef.current && !socketRef.current.connected) {
          cleanupSocket(socketRef.current);
          socketRef.current = null;
          setSocket(null);
        }
        isConnectingRef.current = false;
        reconnectAttempts.current++;

        if (reconnectAttempts.current < maxReconnectAttempts) {
          console.log(
            `🔄 Retrying connection (${reconnectAttempts.current}/${maxReconnectAttempts})...`,
          );
          retryTimeoutRef.current = setTimeout(() => {
            connectSocket(token);
          }, 3000);
        } else {
          console.log("❌ Max connection attempts reached, giving up");
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
          console.log("🟢 Connected to server");
          clearTimeout(connectionTimeoutRef.current);
          setIsConnected(true);
          reconnectAttempts.current = 0;
          isConnectingRef.current = false;
        });

        newSocket.on("connect_error", (error) => {
          console.error("Connection error:", error.message);
          setIsConnected(false);
          isConnectingRef.current = false;
          clearTimeout(connectionTimeoutRef.current);

          if (
            error.message.includes("Authentication error") ||
            error.message.includes("Unauthorized") ||
            error.message.includes("Invalid token")
          ) {
            console.log("❌ Authentication failed, clearing token");
            disconnectSocket();
          }
        });

        newSocket.on("disconnect", (reason) => {
          console.log("🔴 Disconnected from server:", reason);
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
            console.log(`🔄 Auto-reconnecting due to: ${reason}`);
            retryTimeoutRef.current = setTimeout(() => {
              connectSocket(currentTokenRef.current!);
            }, 2000);
          } else {
            disconnectSocket();
          }
        });

        newSocket.on("user_status_changed", ({ userId, isOnline }) => {
          console.log(
            `📡 User ${userId} is ${isOnline ? "online" : "offline"}`,
          );
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
            console.log("⚠️ Ping timeout - disconnecting");
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
    const token = getTokenFromCookies();
    if (token) {
      console.log("🍪 Token found in cookies, auto-connecting socket...");
      connectSocket(token);
    }

    const interval = setInterval(() => {
      const currentToken = getTokenFromCookies();

      if (!isConnectingRef.current) {
        if (currentToken && currentToken !== currentTokenRef.current) {
          console.log("🔄 New token detected, reconnecting...");
          connectSocket(currentToken);
        } else if (
          !currentToken &&
          (socketRef.current?.connected || currentTokenRef.current)
        ) {
          console.log("🚪 No token found, disconnecting...");
          disconnectSocket();
        } else if (
          currentToken &&
          !socketRef.current?.connected &&
          currentTokenRef.current === currentToken
        ) {
          console.log("🔄 Connection lost, attempting reconnection...");
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
