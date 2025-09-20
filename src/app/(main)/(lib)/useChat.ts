import { chatApi } from "@/tanstack/api-services/chatApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IMessage } from "./chat-types";
import { useSidebar } from "./useSidebar";
import { IChat } from "./sidebar-types";
import { useSocket } from "@/providers/socket-provider";
import { useMessage } from "@/hooks/useMessages";
import { toast } from "sonner";
import { TErrorResponse } from "@/app/(auth)/login/(lib)/loginSchema";

type TMessage = {
  text: string;
  sender: string;
};

export const useChat = () => {
  const searchParams = useSearchParams();
  const selectedChatId = searchParams.get("chat");
  const { chatList } = useSidebar();
  const { isConnected } = useSocket();
  const chats = chatList?.data;
  const queryClient = useQueryClient();

  // Get chat topic
  const chatTopic = chats?.find(
    (chat: IChat) => chat.roomId === selectedChatId,
  )?.topicTitle;

  // Use our message hook for socket functionality
  const {
    messages: socketMessages,
    sendMessage: sendSocketMessage,
    isTyping,
    handleTyping,
    joinRoom,
    setMessages: setSocketMessages,
  } = useMessage();

  // Get messages from API (for initial load)
  const { isPending: isChatMessagesLoading, data: chatMessages } = useQuery({
    queryKey: ["chat", "message", selectedChatId],
    queryFn: () => chatApi.chatMessages({ roomId: selectedChatId as string }),
    enabled: !!selectedChatId,
    refetchOnWindowFocus: true,
    refetchInterval: 3000,
  });

  const { mutate: deleteMessage, isPending: isMessageDeleting } = useMutation({
    mutationFn: chatApi.deleteMessage,
    onSuccess: (data) => {
      toast.success(data.message || "Message deletetion Successful");
      queryClient.resetQueries({
        queryKey: ["chat", "message", selectedChatId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chat", "message", selectedChatId],
      });
    },
    onError: (error: TErrorResponse) => {
      toast.error(error.data.message || "Message deletetion unsuccessful");
      console.log(error);
    },
  });
  const [message, setMessage] = useState<TMessage>({ text: "", sender: "" });
  const [messages, setMessages] = useState<IMessage[]>([]);
  const prevChatIdRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef<boolean>(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset initialization ref on mount
  useEffect(() => {
    hasInitializedRef.current = false;
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Handle room changes and initial message loading
  useEffect(() => {
    if (!selectedChatId) {
      // Only update state if necessary to avoid unnecessary re-renders
      if (messages.length > 0 || socketMessages.length > 0) {
        setMessages([]);
        setSocketMessages([]);
      }
      hasInitializedRef.current = false;
      return;
    }

    if (
      selectedChatId !== prevChatIdRef.current ||
      !hasInitializedRef.current
    ) {
      const joinWithRetry = () => {
        if (isConnected) {
          console.log("🔄 Switching to chat room:", selectedChatId);
          // Only clear socketMessages if not already empty
          if (socketMessages.length > 0) {
            setSocketMessages([]);
          }
          joinRoom(selectedChatId);
          hasInitializedRef.current = true;
          prevChatIdRef.current = selectedChatId;
        } else {
          console.log("⏳ Waiting for socket connection...");
          retryTimeoutRef.current = setTimeout(joinWithRetry, 500);
        }
      };
      joinWithRetry();
    }

    // Cleanup retry timeout on unmount or dependency change
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [selectedChatId, isConnected]); // Removed joinRoom, setSocketMessages from deps

  // Handle message updates from API
  useEffect(() => {
    if (chatMessages?.data && selectedChatId) {
      console.log("📚 Loading messages from API");
      setMessages(chatMessages.data);
      setSocketMessages(chatMessages.data);
    }
  }, [chatMessages, selectedChatId, setSocketMessages]);

  // Handle socket message updates
  useEffect(() => {
    if (socketMessages.length > 0 && selectedChatId) {
      console.log("🔄 Updating messages from socket");
      setMessages((prev) => {
        // Merge new socket messages with existing, avoiding duplicates
        const mergedMessages = [
          ...prev,
          ...socketMessages.filter(
            (sm) => !prev.some((pm) => pm._id === sm._id),
          ),
        ];
        return mergedMessages;
      });
    }
  }, [socketMessages, selectedChatId]);

  // Debug: Log messages state changes
  useEffect(() => {
    console.log("📊 Messages state updated:", messages.length);
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = () => {
    if (!message?.text?.trim() || !selectedChatId || !message.sender) {
      console.warn("Cannot send message: missing required fields");
      return;
    }

    if (!isConnected) {
      console.warn("Cannot send message: not connected to socket");
      return;
    }

    console.log("📤 Sending message via socket");

    // Send message via socket
    sendSocketMessage(selectedChatId, message.sender, message.text);

    // Clear the input
    setMessage({ text: "", sender: message.sender });

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    handleTyping(selectedChatId, message.sender, false);
  };

  // Handle typing indicators
  const handleMessageInputChange = (newMessage: TMessage) => {
    setMessage(newMessage);

    if (selectedChatId && newMessage.sender && isConnected) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      handleTyping(selectedChatId, newMessage.sender, true);

      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(selectedChatId, newMessage.sender, false);
        typingTimeoutRef.current = null;
      }, 1000);
    }
  };

  // Get current typing users (excluding current user)
  const getTypingUsers = (): string[] => {
    if (!selectedChatId) return [];

    return Object.keys(isTyping)
      .filter((key) => {
        const [roomId, senderId] = key.split("-");
        return (
          roomId === selectedChatId &&
          senderId !== message.sender &&
          isTyping[key] === true
        );
      })
      .map((key) => key.split("-")[1]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      setMessages([]);
      setSocketMessages([]);
      setMessage({ text: "", sender: "" });
      hasInitializedRef.current = false;
    };
  }, [setSocketMessages]);

  const handleDeleteMessage = ({ messageId }: { messageId: string }) => {
    deleteMessage({ roomId: selectedChatId as string, messageId });
  };

  return {
    // Message state
    setMessage: handleMessageInputChange,
    setMessages,
    message,
    messages,

    // Actions
    handleSendMessage,

    // Chat info
    selectedChatId,
    chatMessages,
    isChatMessagesLoading,
    chatTopic,
    handleDeleteMessage,
    isMessageDeleting,

    // Socket status
    isConnected,

    // Typing indicators
    typingUsers: getTypingUsers(),
    isTyping: getTypingUsers().length > 0,
  };
};
