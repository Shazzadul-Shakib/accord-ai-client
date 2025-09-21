import { chatApi } from "@/tanstack/api-services/chatApi";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
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

  // Get messages from API (for infinite scroll)
  const {
    data: chatMessages,
    isLoading: isChatMessagesLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch: refetchMessages,
  } = useInfiniteQuery({
    queryKey: ["chat", "message", selectedChatId],
    queryFn: ({ pageParam }) =>
      chatApi.chatMessages({
        roomId: selectedChatId as string,
        cursor: pageParam,
      }),
    enabled: !!selectedChatId,
    refetchOnWindowFocus: false, // Disable auto-refetch to prevent scroll issues
    refetchInterval: false, // Use socket for real-time updates instead
    getNextPageParam: (lastPage) => lastPage?.data?.nextCursor ?? undefined,
    initialPageParam: "",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Summary mutation - only called when user clicks
  const {
    mutate: generateSummary,
    isPending: isSummaryLoading,
    data: chatSummary,
    reset: resetSummary,
  } = useMutation({
    mutationFn: () => chatApi.getSummary({ roomId: selectedChatId as string }),
    onError: (error: TErrorResponse) => {
      toast.error(error.data?.message || "Failed to generate summary");
      console.error("Summary generation error:", error);
    },
    onSuccess: () => {
      toast.success("Summary generated successfully!");
    },
  });

  const { mutate: deleteMessage, isPending: isMessageDeleting } = useMutation({
    mutationFn: chatApi.deleteMessage,
    onSuccess: (data) => {
      toast.success(data.message || "Message deletion Successful");
      queryClient.invalidateQueries({
        queryKey: ["chat", "message", selectedChatId],
      });
    },
    onError: (error: TErrorResponse) => {
      toast.error(error.data.message || "Message deletion unsuccessful");
      console.log(error);
    },
  });

  const [message, setMessage] = useState<TMessage>({ text: "", sender: "" });
  const prevChatIdRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef<boolean>(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Combine and deduplicate messages from API and socket
  const messages = useMemo(() => {
    if (!chatMessages?.pages) return { messages: [], nextCursor: "" };

    // Flatten all pages of messages
    const allApiMessages = chatMessages.pages.flatMap(
      (page) => page.data.messages,
    );

    // Create a map for efficient deduplication
    const messageMap = new Map<string, IMessage>();

    // Add API messages first (older messages)
    allApiMessages.forEach((msg) => {
      if (msg._id) {
        messageMap.set(msg._id, msg);
      }
    });

    // Add socket messages (newer messages), replacing any duplicates
    socketMessages.forEach((msg) => {
      if (msg._id) {
        messageMap.set(msg._id, msg);
      }
    });

    // Convert back to array and sort by timestamp
    const combinedMessages = Array.from(messageMap.values()).sort((a, b) => {
      const timeA = new Date( a.createdAt || 0).getTime();
      const timeB = new Date( b.createdAt || 0).getTime();
      return timeA - timeB;
    });

    return {
      messages: combinedMessages,
      nextCursor: chatMessages.pages[0]?.data?.nextCursor || "",
    };
  }, [chatMessages, socketMessages]);

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
      setSocketMessages([]);
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
          // Clear socket messages when switching rooms
          setSocketMessages([]);
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
  }, [selectedChatId, isConnected, joinRoom, setSocketMessages]);

  // Reset summary when chat changes
  useEffect(() => {
    if (selectedChatId !== prevChatIdRef.current) {
      resetSummary();
    }
  }, [selectedChatId, resetSummary]);

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
      setSocketMessages([]);
      setMessage({ text: "", sender: "" });
      hasInitializedRef.current = false;
    };
  }, [setSocketMessages]);

  const handleDeleteMessage = ({ messageId }: { messageId: string }) => {
    deleteMessage({ roomId: selectedChatId as string, messageId });
  };

  // Improved fetchNextPage wrapper
  const handleFetchNextPage = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      try {
        return await fetchNextPage();
      } catch (error) {
        console.error("Error fetching next page:", error);
        toast.error("Failed to load older messages");
        throw error;
      }
    }
  };

  return {
    // Message state
    setMessage: handleMessageInputChange,
    message,
    messages,

    // Actions
    handleSendMessage,

    // Chat info
    selectedChatId,
    isFetchingNextPage,
    fetchNextPage: handleFetchNextPage,
    hasNextPage,
    chatMessages,
    isChatMessagesLoading,
    chatTopic,
    handleDeleteMessage,
    isMessageDeleting,
    chatSummary,
    isSummaryLoading,

    // Socket status
    isConnected,

    // Typing indicators
    typingUsers: getTypingUsers(),
    isTyping: getTypingUsers().length > 0,

    // Additional utilities
    refetchMessages,
    generateSummary,
  };
};
