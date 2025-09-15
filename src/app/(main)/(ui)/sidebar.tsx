"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Concert_One } from "next/font/google";
import Image from "next/image";
import { LogOut, PlusSquare, Search, User } from "lucide-react";
import { ChatSidebarProps } from "../(lib)/sidebar-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as customDialog from "@/components/ui/dialog";
import AddTopicRequest from "./modals/add-topic-request";

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
          ? "hidden border-b-0 border-l-0 lg:block lg:w-[450px] lg:border-r"
          : "w-full border-b-0 border-l-0 lg:w-[450px] lg:border-r"
      } bg-secondary border-border`}
    >
      {/* Header */}
      <div className="border-border border-b-2 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1
            className={`text-primary text-2xl font-bold ${concert.className}`}
          >
            ACCORD-AI
          </h1>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  src="/user.jpg"
                  alt="user profile"
                  height={33}
                  width={33}
                  className="border-primary h-[36px] w-[36px] cursor-pointer rounded-full border-[3px] object-cover"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-secondary text-muted/90">
                <DropdownMenuItem className="hover:bg-border focus:bg-border focus:text-muted/80 cursor-pointer text-xs sm:text-sm">
                  <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-destructive/20 focus:bg-destructive/20 focus:text-muted/80 cursor-pointer text-xs sm:text-sm">
                  <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
      <div className="flex items-center justify-between">
        <h1 className="text-primary mt-2 px-4 py-2 text-xl font-semibold">
          Conversations
        </h1>
        <div>
          <customDialog.Dialog>
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
              <AddTopicRequest/>
            </customDialog.DialogContent>
          </customDialog.Dialog>
        </div>
      </div>
      <div className="h-[calc(100vh-175px)] overflow-y-auto px-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatSelect(chat.id)}
            className={`group relative mx-1 my-2 rounded-lg transition-all duration-200 ease-in-out ${
              selectedChatId === chat.id
                ? "bg-primary/10 shadow-lg"
                : "hover:bg-secondary/80"
            }`}
          >
            <div className="flex items-center gap-4 p-3">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ring-primary/5">
                <span className="text-primary text-lg font-medium">
                  {chat.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-primary/90 truncate text-sm font-semibold">
                    {chat.title}
                  </h3>
                  <p className="text-muted/60 text-xs font-medium">
                    {chat.timestamp}
                  </p>
                </div>
                <p className="text-muted/70 mt-0.5 line-clamp-1 text-xs">
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <div className="mt-2">
                    <span className="bg-primary/90 text-primary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm">
                      {chat.unread} new {chat.unread === 1 ? "message" : "messages"}
                    </span>
                  </div>
                )}
              </div>
              <div className={`absolute left-0 top-0 h-full w-1 rounded-l-lg transition-all duration-200 ${
                selectedChatId === chat.id ? "bg-primary" : "bg-transparent group-hover:bg-primary/30"
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
