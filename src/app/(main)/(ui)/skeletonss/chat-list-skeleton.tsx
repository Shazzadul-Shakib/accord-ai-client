const ChatListSkeleton = () => {
  return (
    <div className="group relative mx-1 my-2 animate-pulse rounded-lg">
      <div className="flex items-center gap-4 p-3">
        <div className="bg-border/60 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="bg-border/60 h-4 w-32 rounded"></div>
            <div className="bg-border/40 h-3 w-12 rounded"></div>
          </div>
          <div className="bg-border/40 mt-2 h-3 w-48 rounded"></div>
        </div>
        <div className="absolute top-0 left-0 h-full w-1 rounded-l-lg bg-transparent" />
      </div>
    </div>
  );
};

export default ChatListSkeleton;
