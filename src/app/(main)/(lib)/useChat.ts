import { chatApi } from "@/tanstack/api-services/chatApi";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IMessage } from "./chat-types";
import { useSidebar } from "./useSidebar";
import { IChat } from "./sidebar-types";

export const useChat = () => {
  const searchParams = useSearchParams();
  const selectedChatId = searchParams.get("chat");
  const { chatList } = useSidebar();
  const chats = chatList?.data;

  const chatTopic = chats?.find(
    (chat: IChat) => chat.roomId === selectedChatId,
  )?.topicTitle;

  // get messages
  const { isPending: isChatMessagesLoading, data: chatMessages } = useQuery({
    queryKey: ["chat", "message"],
    queryFn: () => chatApi.chatMessages({ roomId: selectedChatId || "" }),
  });

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (selectedChatId && chatMessages) {
      setMessages(chatMessages.data);
    } else {
      setMessages([]);
    }
  }, [selectedChatId, chatMessages]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChatId) {
      const newMessage = {
        _id: String(Date.now()), // Temporary ID until server response
        text: message,
        sender: {
          _id: "user_id", // This should be replaced with actual user ID
          name: "User" // This should be replaced with actual user name
        },
        roomId: selectedChatId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  return {
    setMessage,
    setMessages,
    message,
    messages,
    handleSendMessage,
    selectedChatId,
    chatMessages,
    isChatMessagesLoading,
    chatTopic,
  };
};
