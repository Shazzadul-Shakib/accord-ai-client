"use client";

import { useSocket } from "@/providers/socket-provider";


export const useOnlineUsers = () => {
  const { onlineUsers } = useSocket();

  const isUserOnline = (userId: string): boolean => {
    return onlineUsers.includes(userId);
  };

  return {
    onlineUsers,
    isUserOnline,
    onlineCount: onlineUsers.length,
  };
};
