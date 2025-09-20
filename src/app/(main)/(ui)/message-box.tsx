"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IMessage } from "../(lib)/chat-types";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { useChat } from "../(lib)/useChat";

const MessageBox: React.FC<{ msg: IMessage; user: string }> = ({
  msg,
  user,
}) => {
  const { handleDeleteMessage }=useChat();
  return (
    <div
      key={msg._id}
      className={`flex gap-1 sm:gap-2 ${
        msg.sender._id === user ? "justify-end" : "justify-start"
      }`}
    >
      <div className="group relative max-w-[85%] min-w-[25%] sm:max-w-[75%]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`absolute top-0 ${
                msg.sender._id === user
                  ? "-left-6 sm:-left-10"
                  : "-right-6 sm:-right-10"
              } hover:bg-border rounded-md p-1 opacity-20 transition-opacity group-hover:opacity-100 sm:opacity-0`}
            >
              <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={msg.sender._id === user ? "start" : "end"}
            className="bg-secondary text-muted/90"
          >
            <DropdownMenuItem
              onClick={() =>
                handleDeleteMessage({ messageId: msg._id as string })
              }
              className="hover:bg-destructive/20 focus:bg-destructive/20 focus:text-muted/80 cursor-pointer text-xs sm:text-sm"
            >
              <Trash className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div
          className={`w-full p-2 sm:p-3 ${
            msg.sender._id === user
              ? "bg-primary text-primary-foreground rounded-l-lg rounded-br-lg"
              : "bg-border text-muted rounded-r-lg rounded-bl-lg"
          }`}
        >
          <p className="text-xs break-words sm:text-sm">{msg.text}</p>
          <p className="mt-1 text-end text-[8px] opacity-70 sm:mt-2 sm:text-[10px]">
            {new Date(msg.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
