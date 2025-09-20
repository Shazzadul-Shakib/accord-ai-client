"use client";

import {
  ArrowLeft,
  Edit,
  MoreVertical,
  SendIcon,
  Trash,
  WandSparkles,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NotSelectedChat from "./not-selected-chat";
import { useChat } from "../(lib)/useChat";
import { useProfile } from "../profile/(lib)/useProfile";
import MessageBox from "./message-box";
import MessageBoxSkeleton from "./skeletonss/message-box-skeleton";
import { useRouter } from "next/navigation";
import TypingIndicator from "./typing-indicator";
import { useEffect, useRef } from "react";

const ChatContainer: React.FC = () => {
  const {
    handleSendMessage,
    selectedChatId,
    message,
    messages,
    setMessage,
    isChatMessagesLoading,
    chatTopic,
    isConnected,
    typingUsers,
    isTyping,
    isMessageDeleting,
  } = useChat();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { loggedUser } = useProfile();
  const user = loggedUser?.data?._id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!selectedChatId) {
    return <NotSelectedChat selectedChatId={selectedChatId as string} />;
  }

  return (
    <div
      className={`${
        selectedChatId ? "w-full lg:flex-1" : "hidden lg:flex lg:flex-1"
      } bg-background flex h-full flex-col`}
    >
      {/* Chat Header */}
      <div className="border-border bg-secondary border-b p-4.5 sm:p-0 sm:py-3">
        <div className="mx-auto flex w-[92%] max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="bg-border flex items-center rounded-md px-4 py-1.5 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-primary text-base font-semibold sm:text-lg">
              {chatTopic}
            </h2>

            {/* Connection Status Indicator */}
            <div className="flex items-center gap-1">
              {isConnected ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Wifi className="h-4 w-4 text-green-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connected</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <WifiOff className="h-4 w-4 text-red-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Disconnected</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    /* Add AI summary generation logic */
                  }}
                  className="bg-primary flex cursor-pointer items-center rounded-md px-2 py-1.5 sm:px-3 sm:text-sm"
                >
                  <WandSparkles className="h-4 w-4 sm:h-6 sm:w-6" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate Summary</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`hover:bg-border cursor-pointer rounded-md p-1.5 opacity-100`}
                  >
                    <MoreVertical className="h-6 w-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-secondary text-muted/90">
                  <DropdownMenuItem className="hover:bg-border focus:bg-border focus:text-muted/80 cursor-pointer text-xs sm:text-sm">
                    <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-destructive/20 focus:bg-destructive/20 focus:text-muted/80 cursor-pointer text-xs sm:text-sm">
                    <Trash className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex flex-1 flex-col-reverse overflow-y-auto p-2 sm:p-4">
        <div className="mx-auto w-[92%] max-w-6xl space-y-6 sm:space-y-4">
          {/* Messages */}
          {isChatMessagesLoading || isMessageDeleting ? (
            <div className="w-full">
              <MessageBoxSkeleton className="mr-auto" position="left" />
              <MessageBoxSkeleton className="ml-auto" position="right" />
              <MessageBoxSkeleton className="mr-auto" position="left" />
              <MessageBoxSkeleton className="ml-auto" position="right" />
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBox key={msg._id || i} msg={msg} user={user} />
            ))
          )}
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <TypingIndicator
                typingUsers={typingUsers}
                className="bg-border max-w-xs rounded-lg"
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Area */}
      <div className="border-border bg-secondary border-t p-2 sm:p-4">
        <div className="mx-auto flex max-w-6xl items-end gap-2 sm:gap-3">
          <textarea
            value={message?.text || ""}
            onChange={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
              setMessage({
                text: e.target.value,
                sender: user || "",
              });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              !isConnected ? "Connecting..." : "Type your message..."
            }
            disabled={!isConnected}
            rows={1}
            style={{ resize: "none" }}
            className="border-border focus:ring-primary bg-border max-h-[150px] min-h-[36px] flex-1 overflow-y-auto rounded-lg border px-3 py-1.5 text-xs placeholder:text-xs focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:max-h-[200px] sm:min-h-[40px] sm:px-4 sm:py-2 sm:text-sm sm:placeholder:text-sm"
          />
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50 flex h-[36px] items-center gap-1 rounded-lg px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:h-[40px] sm:gap-2 sm:px-7"
            onClick={handleSendMessage}
            disabled={!message?.text?.trim() || !isConnected}
          >
            <SendIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Connection Status Message */}
        {!isConnected && (
          <div className="mx-auto mt-2 max-w-6xl">
            <p className="text-muted-foreground text-center text-xs">
              Reconnecting to chat...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
