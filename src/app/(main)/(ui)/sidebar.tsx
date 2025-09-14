"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Concert_One } from "next/font/google";
import Image from "next/image";

const concert = Concert_One({
  weight: "400",
});

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface ChatSidebarProps {
  chats: Chat[];
}

export default function ChatSidebar({ chats }: ChatSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedChatId = searchParams.get("chat");

  const handleChatSelect = (chatId: string) => {
    router.push(`?chat=${chatId}`);
  };

  return (
    <div
      className={`${
        selectedChatId
          ? "hidden lg:block lg:w-80 lg:border-r"
          : "w-full lg:w-80 lg:border-r"
      } bg-secondary border-border`}
    >
      {/* Header */}
      <div className="border-b-2 border-border py-3 px-4">
        <div className="flex items-center justify-between">
          <h1 className={`text-primary text-xl font-bold ${concert.className}`}>
            ACCORD-AI
          </h1>
          <div>
            <Image
              src="/user.jpg"
              alt="user profile"
              height={33}
              width={33}
              className="rounded-full h-[36px] w-[36px] border-[3px] border-primary object-cover"
            />
          </div>
        </div>
      </div>
      {/* Chat List */}
      {/* <div className="h-[calc(100vh-120px)] overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatSelect(chat.id)}
            className={`border-border hover:bg-muted cursor-pointer border-b p-4 transition-colors ${
              selectedChatId === chat.id
                ? "bg-muted border-l-primary border-l-4"
                : ""
            }`}
          >
            <div className="mb-1 flex items-start justify-between">
              <h3 className="flex-1 truncate text-sm font-medium">
                {chat.title}
              </h3>
              {chat.unread > 0 && (
                <span className="bg-primary text-primary-foreground ml-2 rounded-full px-2 py-1 text-xs">
                  {chat.unread}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mb-1 truncate text-sm">
              {chat.lastMessage}
            </p>
            <p className="text-muted-foreground text-xs">{chat.timestamp}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
}
