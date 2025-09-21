import { chatApi } from "@/tanstack/api-services/chatApi";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState, useRef, useMemo } from "react";
import { IMessage } from "./chat-types";
import { useSidebar } from "./useSidebar";
import { IChat } from "./sidebar-types";
import { useSocket } from "@/providers/socket-provider";
import { useMessage } from "@/hooks/useMessages";
import { toast } from "sonner";
import { TErrorResponse } from "@/app/(auth)/login/(lib)/loginSchema";
import { useSafeSearchParams } from "@/hooks/useSearchParams";

type TMessage = {
  text: string;
  sender: string;
};

export const useChat = () => {
  const searchParams = useSafeSearchParams();

  const selectedChatId = searchParams?.get("chat");
  const { chatList } = useSidebar();
  const { isConnected } = useSocket();
  const chats = chatList?.data;
  const queryClient = useQueryClient();

  const chatTopic = chats?.find(
    (chat: IChat) => chat.roomId === selectedChatId,
  )?.topicTitle;

  const {
    messages: socketMessages,
    sendMessage: sendSocketMessage,
    isTyping,
    handleTyping,
    joinRoom,
    setMessages: setSocketMessages,
  } = useMessage();

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
    refetchOnWindowFocus: false,
    refetchInterval: false,
    getNextPageParam: (lastPage) => lastPage?.data?.nextCursor ?? undefined,
    initialPageParam: "",
    staleTime: 5 * 60 * 1000,
  });

  const { isLoading: isSummaryLoading, data: chatSummary } = useQuery({
    queryKey: ["summary", selectedChatId],
    queryFn: () => chatApi.getSummary({ roomId: selectedChatId as string }),
    enabled: Boolean(selectedChatId),
    staleTime: 1000 * 60,
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
    },
  });

  const [message, setMessage] = useState<TMessage>({ text: "", sender: "" });
  const prevChatIdRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef<boolean>(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messages = useMemo(() => {
    if (!chatMessages?.pages) return { messages: [], nextCursor: "" };

    const allApiMessages = chatMessages.pages.flatMap(
      (page) => page.data.messages,
    );

    const messageMap = new Map<string, IMessage>();

    allApiMessages.forEach((msg) => {
      if (msg._id) {
        messageMap.set(msg._id, msg);
      }
    });

    socketMessages.forEach((msg) => {
      if (msg._id) {
        messageMap.set(msg._id, msg);
      }
    });

    const combinedMessages = Array.from(messageMap.values()).sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeA - timeB;
    });

    return {
      messages: combinedMessages,
      nextCursor: chatMessages.pages[0]?.data?.nextCursor || "",
    };
  }, [chatMessages, socketMessages]);

  useEffect(() => {
    hasInitializedRef.current = false;
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const currentChatId = selectedChatId;

    if (!currentChatId) {
      // setSocketMessages([]);
      hasInitializedRef.current = false;
      return;
    }

    if (currentChatId !== prevChatIdRef.current || !hasInitializedRef.current) {
      const joinWithRetry = () => {
        if (!isConnected) {
          retryTimeoutRef.current = setTimeout(joinWithRetry, 500);
          return;
        }

        setSocketMessages([]);
        joinRoom(currentChatId);
        hasInitializedRef.current = true;
        prevChatIdRef.current = currentChatId;
      };

      joinWithRetry();
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [selectedChatId, isConnected, joinRoom, setSocketMessages]);

  const handleSendMessage = () => {
    if (!message?.text?.trim() || !selectedChatId || !message.sender) {
      console.warn("Cannot send message: missing required fields");
      return;
    }

    if (!isConnected) {
      console.warn("Cannot send message: not connected to socket");
      return;
    }


    sendSocketMessage(selectedChatId, message.sender, message.text);
    setMessage({ text: "", sender: message.sender });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    handleTyping(selectedChatId, message.sender, false);
  };

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
    setMessage: handleMessageInputChange,
    message,
    messages,
    handleSendMessage,
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
    isConnected,
    typingUsers: getTypingUsers(),
    isTyping: getTypingUsers().length > 0,
    refetchMessages,
  };
};
