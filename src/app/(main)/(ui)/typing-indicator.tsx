"use client";

import React from "react";

interface TypingIndicatorProps {
  typingUsers: string[];
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsers,
  className = "",
}) => {
  if (typingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    return "someone is typing";
  };

  return (
    <div
      className={`text-muted-foreground flex items-center gap-2 px-4 py-2 text-sm ${className}`}
    >
      <span>{getTypingText()}</span>
      <div className="flex space-x-1">
        <div className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"></div>
        <div
          className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
