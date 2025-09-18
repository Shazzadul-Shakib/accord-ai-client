import ChatSidebar from "./(ui)/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

// Demo chat data


export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-[100dvh]">
      {/* Chat List Sidebar - Server Component */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <div className="bg-background flex-1">{children}</div>
    </div>
  );
}

