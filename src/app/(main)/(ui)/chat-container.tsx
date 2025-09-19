"use client";

import {
  ArrowLeft,
  Edit,
  MoreVertical,
  SendIcon,
  Trash,
  WandSparkles,
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

const ChatContaineer: React.FC = () => {
  const {
    handleSendMessage,
    selectedChatId,
    message,
    messages,
    setMessage,
    isChatMessagesLoading,
    chatTopic,
  } = useChat();
  const { loggedUser } = useProfile();
  const user = loggedUser?.data?._id;

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
      <div className="border-border bg-secondary border-b p-4.5 sm:px-6 sm:py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="bg-border flex items-center rounded-md px-4 py-1.5 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-base font-semibold text-primary sm:text-lg">{chatTopic}</h2>
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
          {isChatMessagesLoading ? (
            <div className="w-full">
              <MessageBoxSkeleton className="mr-auto" position="left" />
              <MessageBoxSkeleton className="ml-auto" position="right" />
              <MessageBoxSkeleton className="mr-auto" position="left" />
              <MessageBoxSkeleton className="ml-auto" position="right" />
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBox key={msg._id} msg={msg} user={user} />
            ))
          )}
        </div>
      </div>

      {/* Message Input Area */}
      <div className="border-border bg-secondary border-t p-2 sm:p-4">
        <div className="mx-auto flex max-w-6xl items-end gap-2 sm:gap-3">
          <textarea
            value={message}
            onChange={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            rows={1}
            style={{ resize: "none" }}
            className="border-border focus:ring-primary bg-border max-h-[150px] min-h-[36px] flex-1 overflow-y-auto rounded-lg border px-3 py-1.5 text-xs placeholder:text-xs focus:ring-2 focus:outline-none sm:max-h-[200px] sm:min-h-[40px] sm:px-4 sm:py-2 sm:text-sm sm:placeholder:text-sm"
          />
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-[36px] items-center gap-1 rounded-lg px-4 transition-colors disabled:opacity-50 sm:h-[40px] sm:gap-2 sm:px-7"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <SendIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContaineer;
