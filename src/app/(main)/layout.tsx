import ChatSidebar from "./(ui)/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

// Demo chat data
const demoChats = [
  {
    id: "1",
    title: "Project Planning Discussion",
    lastMessage: "Let's schedule the sprint review for next week",
    timestamp: "2 min ago",
    unread: 2,
  },
  {
    id: "2",
    title: "Design Team Chat",
    lastMessage: "The new mockups look great!",
    timestamp: "1 hour ago",
    unread: 0,
  },
  {
    id: "3",
    title: "Marketing Strategy",
    lastMessage: "We need to finalize the campaign budget",
    timestamp: "3 hours ago",
    unread: 1,
  },
  {
    id: "4",
    title: "Customer Support",
    lastMessage: "Thank you for resolving the issue quickly",
    timestamp: "1 day ago",
    unread: 0,
  },
  {
    id: "5",
    title: "Development Updates",
    lastMessage: "The API integration is complete",
    timestamp: "2 days ago",
    unread: 0,
  },
  {
    id: "6",
    title: "Development Updates",
    lastMessage: "The API integration is complete",
    timestamp: "2 days ago",
    unread: 0,
  },
  {
    id: "7",
    title: "Development Updates",
    lastMessage: "The API integration is complete",
    timestamp: "2 days ago",
    unread: 0,
  },
];

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-[100dvh]">
      {/* Chat List Sidebar - Server Component */}
      <ChatSidebar chats={demoChats} />

      {/* Main Chat Area */}
      <div className="bg-background flex-1">{children}</div>
    </div>
  );
}

