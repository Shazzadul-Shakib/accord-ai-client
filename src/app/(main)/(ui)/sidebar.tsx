"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Concert_One } from "next/font/google";
import Image from "next/image";
import { Search } from "lucide-react";
import { ChatSidebarProps } from "../(lib)/sidebar-types";

const concert = Concert_One({
  weight: "400",
});


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
          ? "hidden lg:block lg:w-[450px] lg:border-r"
          : "w-full lg:w-[450px] lg:border-r"
      } bg-secondary border-border`}
    >
      {/* Header */}
      <div className="border-border border-b-2 px-4 py-3">
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
              className="border-primary h-[36px] w-[36px] rounded-full border-[3px] object-cover"
            />
          </div>
        </div>
      </div>
      {/* Search field */}
      <div className="mt-2 px-4 py-2">
        <div className="relative">
          <Search className="text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="border-border bg-secondary placeholder:text-muted focus:ring-primary w-full rounded-md border px-9 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Chat List */}
      <h1 className="text-primary mt-2 px-4 py-2 text-lg font-semibold">
        Conversations
      </h1>
      <div className="h-[calc(100vh-180px)] overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatSelect(chat.id)}
            className={`border-border hover:bg-border cursor-pointer border-b p-4 transition-all duration-200 ease-in-out ${
              selectedChatId === chat.id
                ? "bg-border border-l-primary border-l-4 shadow-sm"
                : "hover:translate-x-1"
            }`}
          >
            <div className="flex gap-3">
              <div className="bg-primary/15 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform hover:scale-105">
                <span className="text-primary text-base font-semibold">
                  {chat.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="truncate text-sm font-bold tracking-wide">
                    {chat.title}
                  </h3>
                  <p className="text-muted/70 flex-shrink-0 text-xs">
                    {chat.timestamp}
                  </p>
                </div>
                <p className="text-muted/70 mt-1 line-clamp-2 text-xs leading-relaxed">
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground animate-pulse rounded-full px-3 py-1 text-xs font-medium shadow-sm">
                      {chat.unread} new{" "}
                      {chat.unread === 1 ? "message" : "messages"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
