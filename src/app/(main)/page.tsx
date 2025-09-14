// page.tsx (Updated with demo messages)
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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

  // Load messages for selected chat
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
    return (
      <div
        className={`${
          selectedChatId ? "w-full lg:flex-1" : "hidden lg:flex lg:flex-1"
        } bg-background flex items-center justify-center`}
      >
        <div className="text-muted-foreground text-center">
          <h2 className="mb-2 text-2xl font-semibold">Welcome to Chat</h2>
          <p>Select a conversation from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        selectedChatId ? "w-full lg:flex-1" : "hidden lg:flex lg:flex-1"
      } bg-background flex h-full flex-col`}
    >
      {/* Chat Header */}
      <div className="border-border bg-muted/30 border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat {selectedChatId}</h2>
          <button
            onClick={() => window.history.back()}
            className="bg-muted hover:bg-muted/80 rounded-lg px-3 py-1 text-sm transition-colors lg:hidden"
          >
            Back
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p>{msg.text}</p>
                <p className="mt-1 text-xs opacity-70">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input Area */}
      <div className="border-border bg-muted/30 border-t p-4">
        <div className="mx-auto flex max-w-4xl gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="border-border focus:ring-primary bg-background flex-1 rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
          />
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
