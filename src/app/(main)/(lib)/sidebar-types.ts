export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface ChatSidebarProps {
  chats: Chat[];
}
