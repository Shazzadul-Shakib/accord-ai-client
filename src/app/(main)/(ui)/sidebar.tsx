"use client";

import { usePathname } from "next/navigation";
import { Concert_One } from "next/font/google";
import { MessageSquareDot, PlusSquare, Search } from "lucide-react";

import * as customDialog from "@/components/ui/dialog";
import AddTopicRequest from "./modals/add-topic-request";
import Profile from "./profile/profile";
import { useSidebar } from "../(lib)/useSidebar";
import { IChat } from "../(lib)/sidebar-types";
import ChatList from "./chat-list";
import ChatListSkeleton from "./skeletonss/chat-list-skeleton";
import { useState, useMemo } from "react";
import Notification from "./notification";

const concert = Concert_One({
  weight: "400",
});

export default function ChatSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isChatListLoading, chatList, selectedChatId } = useSidebar();

  const chats = chatList?.data;

  const filteredChats = useMemo(() => {
    if (!chats) return [];
    if (!searchQuery.trim()) return chats;

    return chats.filter((chat: IChat) =>
      chat.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [chats, searchQuery]);

  // Hide sidebar for small and medium screens when on profile page
  if (pathname === "/profile") {
    return (
      <div className="hidden lg:block">
        {/* Rest of the sidebar content */}
        <div
          className={`${
            selectedChatId
              ? "hidden border-b-0 border-l-0 lg:block lg:w-[450px] lg:border-r"
              : "w-full border-b-0 border-l-0 lg:w-[450px] lg:border-r"
          } bg-secondary border-border`}
        >
          {/* Header */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <h1
                className={`text-primary flex items-center gap-2 text-2xl font-bold ${concert.className}`}
              >
                <MessageSquareDot />
                ACCORD-AI
              </h1>
              <div className="flex items-center gap-4">
                <Notification />
                <Profile />
              </div>
            </div>
          </div>
          {/* Search field */}
          <div className="mt-2 px-4 py-2">
            <div className="relative">
              <Search className="text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="border-border bg-secondary placeholder:text-muted focus:ring-primary w-full rounded-md border px-9 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex items-center justify-between">
            <h1 className="text-primary mt-2 px-4 py-2 text-xl font-semibold">
              Conversations
            </h1>
            <div>
              <customDialog.Dialog open={open} onOpenChange={setOpen}>
                <customDialog.DialogTrigger className="text-muted bg-primary mr-3 flex cursor-pointer items-center rounded-md px-4 py-1.5">
                  <PlusSquare className="h-5 w-5" />
                </customDialog.DialogTrigger>
                <customDialog.DialogContent>
                  <customDialog.DialogHeader>
                    <customDialog.DialogTitle>
                      Add Topic Request
                    </customDialog.DialogTitle>
                    <customDialog.DialogDescription>
                      Create a new conversation by entering your topic or
                      question
                    </customDialog.DialogDescription>
                  </customDialog.DialogHeader>
                  <AddTopicRequest onSuccess={() => setOpen(false)} />
                </customDialog.DialogContent>
              </customDialog.Dialog>
            </div>
          </div>
          <div className="h-[calc(100vh-175px)] overflow-y-auto px-2">
            {isChatListLoading ? (
              <ChatListSkeleton />
            ) : (
              filteredChats.map((chat: IChat) => (
                <ChatList key={chat.roomId} chat={chat} />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        selectedChatId
          ? "hidden border-b-0 border-l-0 lg:block lg:w-[450px] lg:border-r"
          : "w-full border-b-0 border-l-0 lg:w-[450px] lg:border-r"
      } bg-secondary border-border`}
    >
      {/* Header */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <h1
            className={`text-primary flex items-center gap-2 text-2xl font-bold ${concert.className}`}
          >
            <MessageSquareDot />
            ACCORD-AI
          </h1>
          <div className="flex items-center gap-4">
            <Notification />
            <Profile />
          </div>
        </div>
      </div>
      {/* Search field */}
      <div className="mt-2 px-4 py-2">
        <div className="relative">
          <Search className="text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="border-border bg-secondary placeholder:text-muted focus:ring-primary w-full rounded-md border px-9 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex items-center justify-between">
        <h1 className="text-primary mt-2 px-4 py-2 text-xl font-semibold">
          Conversations
        </h1>
        <div>
          <customDialog.Dialog open={open} onOpenChange={setOpen}>
            <customDialog.DialogTrigger className="text-muted bg-primary mr-3 flex cursor-pointer items-center rounded-md px-4 py-1.5">
              <PlusSquare className="h-5 w-5" />
            </customDialog.DialogTrigger>
            <customDialog.DialogContent>
              <customDialog.DialogHeader>
                <customDialog.DialogTitle>
                  Add Topic Request
                </customDialog.DialogTitle>
                <customDialog.DialogDescription>
                  Create a new conversation by entering your topic or question
                </customDialog.DialogDescription>
              </customDialog.DialogHeader>
              <AddTopicRequest onSuccess={() => setOpen(false)} />
            </customDialog.DialogContent>
          </customDialog.Dialog>
        </div>
      </div>
      <div className="h-[calc(100vh-175px)] overflow-y-auto px-2">
        {isChatListLoading ? (
          <ChatListSkeleton />
        ) : (
          filteredChats.map((chat: IChat) => (
            <ChatList key={chat.roomId} chat={chat} />
          ))
        )}
      </div>
    </div>
  );
}
