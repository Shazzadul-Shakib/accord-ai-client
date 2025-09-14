// page.tsx (Updated with demo messages)
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import NotSelectedChat from "./(ui)/not-selected-chat";
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

// Demo messages for different chats
const demoMessages = {
  "1": [
    {
      id: 1,
      text: "Hey team, let's discuss the project timeline",
      sender: "user",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      text: "Sure! I think we should focus on the MVP features first",
      sender: "other",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      text: "Agreed. What's our deadline for the first milestone?",
      sender: "user",
      timestamp: "10:35 AM",
    },
    {
      id: 4,
      text: "Let's schedule the sprint review for next week",
      sender: "other",
      timestamp: "10:38 AM",
    },
  ],
  "2": [
    {
      id: 1,
      text: "I've uploaded the new design files",
      sender: "other",
      timestamp: "9:15 AM",
    },
    {
      id: 2,
      text: "Thanks! Let me review them",
      sender: "user",
      timestamp: "9:18 AM",
    },
    {
      id: 3,
      text: "The new mockups look great!",
      sender: "user",
      timestamp: "9:45 AM",
    },
  ],
  "3": [
    {
      id: 1,
      text: "How's the marketing campaign coming along?",
      sender: "user",
      timestamp: "2:00 PM",
    },
    {
      id: 2,
      text: "We're making good progress on the content",
      sender: "other",
      timestamp: "2:05 PM",
    },
    {
      id: 3,
      text: "We need to finalize the campaign budget",
      sender: "other",
      timestamp: "2:10 PM",
    },
  ],
  "4": [
    {
      id: 1,
      text: "I'm having trouble with the login feature",
      sender: "other",
      timestamp: "Yesterday",
    },
    {
      id: 2,
      text: "Let me help you with that. Can you describe the issue?",
      sender: "user",
      timestamp: "Yesterday",
    },
    {
      id: 3,
      text: "Thank you for resolving the issue quickly",
      sender: "other",
      timestamp: "Yesterday",
    },
  ],
  "5": [
    {
      id: 1,
      text: "The API integration is complete",
      sender: "other",
      timestamp: "2 days ago",
    },
    {
      id: 2,
      text: "Excellent! Any issues during testing?",
      sender: "user",
      timestamp: "2 days ago",
    },
    {
      id: 3,
      text: "No major issues, just minor tweaks needed",
      sender: "other",
      timestamp: "2 days ago",
    },
  ],
};

export default function Page() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const selectedChatId = searchParams.get("chat");

  useEffect(() => {
    if (
      selectedChatId &&
      demoMessages[selectedChatId as keyof typeof demoMessages]
    ) {
      setMessages(demoMessages[selectedChatId as keyof typeof demoMessages]);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChatId) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

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
      <div className="border-border bg-secondary border-b p-5 sm:px-6 sm:py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="bg-border flex items-center rounded-md px-4 py-1.5 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-base font-semibold sm:text-lg">
              Chat {selectedChatId}
            </h2>
          </div>
          <div className=" flex items-center gap-3">
            <div>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    /* Add AI summary generation logic */
                  }}
                  className="bg-primary flex items-center rounded-md px-2 py-1.5 sm:px-3 sm:text-sm cursor-pointer"
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
                    className={`hover:bg-border rounded-md p-1.5 cursor-pointer opacity-100`}
                  >
                    <MoreVertical className="h-6 w-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-secondary text-muted/90">
                  <DropdownMenuItem className="hover:bg-secondary focus:bg-secondary focus:text-muted/80 cursor-pointer text-xs sm:text-sm">
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
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-1 sm:gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="group relative max-w-[85%] sm:max-w-[75%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`absolute top-0 ${
                        msg.sender === "user"
                          ? "-left-6 sm:-left-10"
                          : "-right-6 sm:-right-10"
                      } hover:bg-border rounded-md p-1 opacity-20 transition-opacity group-hover:opacity-100 sm:opacity-0`}
                    >
                      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align={msg.sender === "user" ? "start" : "end"}
                    className="bg-secondary text-muted/90"
                  >
                    <DropdownMenuItem className="hover:bg-secondary focus:bg-secondary focus:text-muted/80 cursor-pointer text-xs sm:text-sm">
                      <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-destructive/20 focus:bg-destructive/20 focus:text-muted/80 cursor-pointer text-xs sm:text-sm">
                      <Trash className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div
                  className={`w-full p-2 sm:p-3 ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-l-lg rounded-br-lg"
                      : "bg-border text-muted rounded-r-lg rounded-bl-lg"
                  }`}
                >
                  <p className="text-xs break-words sm:text-sm">{msg.text}</p>
                  <p className="mt-1 text-end text-[10px] opacity-70 sm:mt-2 sm:text-xs">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
}
