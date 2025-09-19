"use client";

import { IChat } from "../(lib)/sidebar-types";
import { useSidebar } from "../(lib)/useSidebar";

const ChatList: React.FC<{ chat: IChat }> = ({ chat }) => {
  const { selectedChatId, handleChatSelect } = useSidebar();
  console.log(chat);
  return (
    <div
      key={chat.roomId}
      onClick={() => handleChatSelect(chat.roomId)}
      className={`group relative mx-1 my-2 cursor-pointer rounded-lg transition-all duration-200 ease-in-out ${
        selectedChatId === chat.roomId
          ? "bg-primary/10 shadow-lg"
          : "hover:bg-secondary/80"
      }`}
    >
      <div className="flex items-center gap-4 p-3">
        <div className="from-primary/20 to-primary/10 ring-primary/5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-sm ring-1">
          <span className="text-primary text-lg font-medium">
            {chat?.topicTitle?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-primary/90 truncate text-sm font-semibold">
              {chat.topicTitle}
            </h3>
            <p
              className={`text-muted/60 text-xs font-medium ${!chat.lastMessage && "hidden"}`}
            >
              {(() => {
                const date = new Date(chat.lastMessageTime);
                const now = new Date();
                const diffInMinutes = Math.floor(
                  (now.getTime() - date.getTime()) / (1000 * 60),
                );

                if (diffInMinutes < 1) return "just now";
                if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

                const diffInHours = Math.floor(diffInMinutes / 60);
                if (diffInHours < 24) return `${diffInHours}h ago`;

                const diffInDays = Math.floor(diffInHours / 24);
                if (diffInDays < 7) return `${diffInDays}d ago`;

                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              })()}
            </p>
          </div>
          <p className="text-muted/70 mt-0.5 line-clamp-1 text-xs">
            {chat.lastMessage}
          </p>
          {/* {chat.unread > 0 && (
                      <div className="mt-2">
                        <span className="bg-primary/90 text-primary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm">
                          {chat.unread} new{" "}
                          {chat.unread === 1 ? "message" : "messages"}
                        </span>
                      </div>
                    )} */}
        </div>
        <div
          className={`absolute top-0 left-0 h-full w-1 rounded-l-lg transition-all duration-200 ${
            selectedChatId === chat.roomId
              ? "bg-primary"
              : "group-hover:bg-primary/30 bg-transparent"
          }`}
        />
      </div>
    </div>
  );
};

export default ChatList;
