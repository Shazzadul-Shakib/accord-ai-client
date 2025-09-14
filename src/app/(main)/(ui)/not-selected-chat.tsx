export default function NotSelectedChat({
  selectedChatId,
}: {
  selectedChatId: string;
}) {
  return (
    <div
      className={`${
        selectedChatId ? "w-full lg:flex-1" : "hidden lg:flex lg:flex-1"
      } bg-background flex items-center justify-center min-h-screen`}
    >
      <div className="text-muted-foreground text-center max-w-md mx-auto p-8 rounded-lg border border-border/40 shadow-lg">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to ACCORD-AI
          </h2>
        </div>
        <p className="text-lg text-muted-foreground/80">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
}
