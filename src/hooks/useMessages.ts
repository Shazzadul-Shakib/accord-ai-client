import { IMessage } from "@/app/(main)/(lib)/chat-types";
import { useSocket } from "@/providers/socket-provider";
import { useEffect, useRef, useState } from "react";

interface UseMessageReturn {
  messages: IMessage[];
  sendMessage: (roomId: string, senderId: string, text: string) => void;
  isTyping: Record<string, boolean>;
  handleTyping: (roomId: string, senderId: string, isTyping: boolean) => void;
  joinRoom: (roomId: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

export const useMessage = (): UseMessageReturn => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const currentRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    const handleRoomMessage = (messageData: {
      text: string;
      senderId: string;
      roomId: string;
      createdAt: string;
      _id: string;
    }) => {
      const newMessage: IMessage = {
        text: messageData.text,
        sender: { _id: messageData.senderId },
        roomId: messageData.roomId,
        createdAt: messageData.createdAt,
        updatedAt: messageData.createdAt,
        _id: messageData._id,
      };

      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some((msg) => msg._id === newMessage._id);
        if (messageExists) {
          return prev;
        }
        return [...prev, newMessage];
      });
    };

    // Listen for typing indicators
    const handleUserTyping = (data: {
      roomId: string;
      senderId: string;
      isTyping: boolean;
    }) => {
      const typingKey = `${data.roomId}-${data.senderId}`;

      setIsTyping((prev) => ({
        ...prev,
        [typingKey]: data.isTyping,
      }));

      // Clear typing indicator after timeout
      if (data.isTyping) {
        if (typingTimeoutRef.current[typingKey]) {
          clearTimeout(typingTimeoutRef.current[typingKey]);
        }

        typingTimeoutRef.current[typingKey] = setTimeout(() => {
          setIsTyping((prev) => ({
            ...prev,
            [typingKey]: false,
          }));
        }, 3000);
      } else {
        if (typingTimeoutRef.current[typingKey]) {
          clearTimeout(typingTimeoutRef.current[typingKey]);
          delete typingTimeoutRef.current[typingKey];
        }
      }
    };

    // Listen for errors
    const handleErrorMessage = (error: Error | string) => {
      // Silent error handling
    };

    // Register event listeners
    socket.on("room_message", handleRoomMessage);
    socket.on("send_message", handleRoomMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("error_message", handleErrorMessage);

    // Cleanup listeners
    return () => {
      socket.off("room_message", handleRoomMessage);
      socket.off("send_message", handleRoomMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("error_message", handleErrorMessage);

      // Clear all typing timeouts
      Object.values(typingTimeoutRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      typingTimeoutRef.current = {};
    };
  }, [socket]);

  // Function to send a message
  const sendMessage = (roomId: string, senderId: string, text: string) => {
    if (!socket || !isConnected || !text.trim()) {
      console.warn("Cannot send message: socket not connected or empty text");
      return;
    }

    // Send to server using your server's expected format
    socket.emit("send_message", {
      roomId,
      senderId,
      text: text.trim(),
      isTyping: false, // Stop typing when sending message
    });

    // Clear any existing typing indicator for this user
    handleTyping(roomId, senderId, false);
  };

  // Function to handle typing indicators
  const handleTyping = (
    roomId: string,
    senderId: string,
    isTyping: boolean,
  ) => {
    if (!socket || !isConnected) return;

    // Send typing indicator to server
    socket.emit("send_message", {
      roomId,
      senderId,
      text: "", // Empty text for typing indicator
      isTyping,
    });
  };

  // Function to join a room
  const joinRoom = (roomId: string) => {
    if (!socket || !isConnected) {
      console.warn("Cannot join room: socket not connected");
      return;
    }

    // Leave previous room if exists
    if (currentRoomRef.current && currentRoomRef.current !== roomId) {
      socket.emit("leave_room", currentRoomRef.current);
    }

    socket.emit("join_room", roomId);
    currentRoomRef.current = roomId;

    // Clear messages when switching rooms
    setMessages([]);
    setIsTyping({});
  };

  return {
    messages,
    sendMessage,
    isTyping,
    handleTyping,
    joinRoom,
    setMessages,
  };
};
