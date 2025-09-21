"use client";

import { ArrowLeft, SendIcon, WandSparkles, Wifi, WifiOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NotSelectedChat from "./not-selected-chat";
import { useChat } from "../(lib)/useChat";
import { useProfile } from "../profile/(lib)/useProfile";
import MessageBox from "./message-box";
import MessageBoxSkeleton from "./skeletonss/message-box-skeleton";
import { useRouter } from "next/navigation";
import TypingIndicator from "./typing-indicator";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ChatContainer: React.FC = () => {
  const {
    handleSendMessage,
    selectedChatId,
    message,
    messages,
    setMessage,
    isChatMessagesLoading,
    chatTopic,
    isConnected,
    typingUsers,
    isTyping,
    isMessageDeleting,
    isSummaryLoading,
    chatSummary,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    generateSummary,
  } = useChat();

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { loggedUser } = useProfile();
  const user = loggedUser?.data?._id;

  // State for managing scroll behavior
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [scrollPositionBeforeLoad, setScrollPositionBeforeLoad] = useState<{
    scrollTop: number;
    scrollHeight: number;
  } | null>(null);

  // Threshold for determining if user is near bottom (in pixels)
  const SCROLL_THRESHOLD = 100;

  // Check if user is near bottom of chat
  const checkIfNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= SCROLL_THRESHOLD;
  }, []);

  // Smooth scroll to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const nearBottom = checkIfNearBottom();
    setIsUserNearBottom(nearBottom);

    // Load more messages when scrolling near top
    if (container.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      // Store current scroll position before loading
      setScrollPositionBeforeLoad({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      });
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, checkIfNearBottom]);

  // Debounced scroll handler for better performance
  const debouncedHandleScroll = useCallback(debounce(handleScroll, 100), [
    handleScroll,
  ]);

  // Effect for handling scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", debouncedHandleScroll);
    return () => container.removeEventListener("scroll", debouncedHandleScroll);
  }, [debouncedHandleScroll]);

  // Handle scroll position preservation when loading older messages
  useEffect(() => {
    const container = containerRef.current;

    // Only restore scroll position if we have stored position and finished loading
    if (!container || !scrollPositionBeforeLoad || isFetchingNextPage) return;

    // Restore scroll position after new messages are loaded
    const restoreScrollPosition = () => {
      if (container && scrollPositionBeforeLoad) {
        const heightDifference =
          container.scrollHeight - scrollPositionBeforeLoad.scrollHeight;
        if (heightDifference > 0) {
          // Maintain the exact scroll position relative to the bottom
          container.scrollTop =
            scrollPositionBeforeLoad.scrollTop + heightDifference;
        }
        setScrollPositionBeforeLoad(null);
      }
    };

    // Use a small timeout to ensure DOM has updated
    const timeoutId = setTimeout(restoreScrollPosition, 100);

    return () => clearTimeout(timeoutId);
  }, [isFetchingNextPage, scrollPositionBeforeLoad]); // Only depend on these specific values

  // Effect for initial load
  useEffect(() => {
    if (!isChatMessagesLoading && messages?.messages && isInitialLoad) {
      setIsInitialLoad(false);
      setShouldScrollToBottom(true);
      // Scroll to bottom immediately on initial load
      setTimeout(() => scrollToBottom("instant"), 100);
    }
  }, [isChatMessagesLoading, messages, isInitialLoad, scrollToBottom]);

  // Effect for new messages
  useEffect(() => {
    if (!messages?.messages || isFetchingNextPage) return; // Don't auto-scroll when loading older messages

    const currentMessageCount = messages.messages.length;

    // Check if new messages were added (not from loading older messages)
    if (
      currentMessageCount > lastMessageCount &&
      !isInitialLoad &&
      !isFetchingNextPage
    ) {
      const newMessagesCount = currentMessageCount - lastMessageCount;
      const latestMessages = messages.messages.slice(-newMessagesCount);

      // Check if any of the new messages are from the current user
      const hasUserMessage = latestMessages.some((msg) => msg.sender === user);

      // Auto-scroll ONLY if:
      // 1. User sent a message
      // 2. User is already near bottom (within threshold)
      if (hasUserMessage || (isUserNearBottom && checkIfNearBottom())) {
        setShouldScrollToBottom(true);
      }
    }

    // Only update message count if we're not loading older messages
    if (!isFetchingNextPage) {
      setLastMessageCount(currentMessageCount);
    }
  }, [
    messages?.messages,
    lastMessageCount,
    user,
    isUserNearBottom,
    checkIfNearBottom,
    isInitialLoad,
    isFetchingNextPage,
  ]);

  // Effect for scrolling to bottom
  useEffect(() => {
    if (shouldScrollToBottom && containerRef.current) {
      // Use a small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        scrollToBottom();
        setShouldScrollToBottom(false);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [shouldScrollToBottom, scrollToBottom]);

  // Effect for typing indicator
  useEffect(() => {
    if (isTyping && isUserNearBottom && !isFetchingNextPage) {
      scrollToBottom();
    }
  }, [isTyping, isUserNearBottom, scrollToBottom, isFetchingNextPage]);

  // Handle sending message
  const handleSendMessageWithScroll = useCallback(() => {
    handleSendMessage();
    setShouldScrollToBottom(true);
  }, [handleSendMessage]);

  // Reset scroll state when chat changes
  useEffect(() => {
    if (selectedChatId) {
      setIsInitialLoad(true);
      setShouldScrollToBottom(true);
      setIsUserNearBottom(true);
      setLastMessageCount(0);
      setScrollPositionBeforeLoad(null);
    }
  }, [selectedChatId]);

  if (!selectedChatId) {
    return <NotSelectedChat selectedChatId={selectedChatId as string} />;
  }

  const summary = chatSummary?.data?.summary;

  return (
    <div
      className={`${
        selectedChatId ? "w-full lg:flex-1" : "hidden lg:flex lg:flex-1"
      } bg-background flex h-full flex-col`}
    >
      {/* Chat Header */}
      <div className="border-border bg-secondary border-b p-4.5 sm:p-0 sm:py-3">
        <div className="mx-auto flex w-[92%] max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="bg-border flex items-center rounded-md px-4 py-1.5 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-primary text-base font-semibold sm:text-lg">
              {chatTopic}
            </h2>

            <div className="flex items-center gap-1">
              {isConnected ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Wifi className="h-4 w-4 text-green-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connected</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <WifiOff className="h-4 w-4 text-red-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Disconnected</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  <Tooltip>
                    <TooltipTrigger
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex cursor-pointer items-center rounded-md px-2 py-1.5 transition-colors disabled:opacity-50 sm:px-3 sm:text-sm"
                      onClick={() => {
                        if (!chatSummary?.data && !isSummaryLoading) {
                          generateSummary();
                        }
                      }}
                      disabled={isSummaryLoading}
                    >
                      <WandSparkles
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${isSummaryLoading ? "animate-spin" : ""}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {chatSummary?.data
                          ? "View AI Summary"
                          : "Generate AI Summary"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>AI Generated Chat Summary</DialogTitle>
                  <DialogDescription>
                    AI-powered summary of your conversation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {isSummaryLoading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="bg-muted h-4 w-3/4 rounded"></div>
                      <div className="bg-muted h-4 w-1/2 rounded"></div>
                      <div className="bg-muted h-4 w-2/3 rounded"></div>
                      <div className="bg-muted h-4 w-5/6 rounded"></div>
                      <div className="bg-muted h-4 w-2/3 rounded"></div>
                    </div>
                  ) : summary ? (
                    <>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Title</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {summary.title}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Description</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {summary.description}
                        </p>
                      </div>
                      {summary.conclusions?.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">
                            Key Conclusions
                          </h3>
                          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                            {summary.conclusions.map(
                              (conclusion: string, i: number) => (
                                <li key={i} className="leading-relaxed">
                                  {conclusion}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                      {summary.points?.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Key Points</h3>
                          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                            {summary.points.map(
                              (point: { event: string }, i: number) => (
                                <li key={i} className="leading-relaxed">
                                  {point.event}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                      <div className="border-t pt-4">
                        <button
                          onClick={() => generateSummary()}
                          disabled={isSummaryLoading}
                          className="text-primary hover:text-primary/80 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          🔄 Regenerate Summary
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <WandSparkles className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                      <p className="text-muted-foreground mb-4 text-sm">
                        No summary available for this conversation yet.
                      </p>
                      <button
                        onClick={() => generateSummary()}
                        disabled={isSummaryLoading || !selectedChatId}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSummaryLoading ? (
                          <>
                            <WandSparkles className="mr-2 inline h-4 w-4 animate-spin" />
                            Generating Summary...
                          </>
                        ) : (
                          <>
                            <WandSparkles className="mr-2 inline h-4 w-4" />
                            Generate Summary
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={containerRef}
        className="flex flex-1 flex-col overflow-y-auto p-2 sm:p-4"
        style={{
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
        }}
      >
        {/* Loading indicator for older messages */}
        {isFetchingNextPage && (
          <div className="mx-auto w-[92%] max-w-6xl py-4">
            <div className="flex justify-center">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
            </div>
            <p className="text-muted-foreground mt-2 text-center text-xs">
              Loading older messages...
            </p>
          </div>
        )}

        <div className="mx-auto w-[92%] max-w-6xl space-y-6 sm:space-y-4">
          {isChatMessagesLoading && !messages?.messages?.length ? (
            <>
              <MessageBoxSkeleton className="mr-auto" position="left" />
              <MessageBoxSkeleton className="ml-auto" position="right" />
              <MessageBoxSkeleton className="mr-auto" position="left" />
              <MessageBoxSkeleton className="ml-auto" position="right" />
            </>
          ) : (
            messages?.messages?.map((msg, i) => (
              <MessageBox key={msg._id || i} msg={msg} user={user} />
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <TypingIndicator
                typingUsers={typingUsers}
                className="bg-muted max-w-xs rounded-lg px-3 py-2"
              />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {!isUserNearBottom &&
        !isChatMessagesLoading &&
        messages?.messages?.length > 0 && (
          <div className="absolute right-6 bottom-20 z-10">
            <button
              onClick={() => {
                setShouldScrollToBottom(true);
                setIsUserNearBottom(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
              aria-label="Scroll to bottom"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        )}

      {/* Message Input */}
      <div className="border-border bg-secondary border-t p-2 sm:p-4">
        <div className="mx-auto flex max-w-6xl items-end gap-2 sm:gap-3">
          <textarea
            value={message?.text || ""}
            onChange={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
              setMessage({
                text: e.target.value,
                sender: user || "",
              });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessageWithScroll();
              }
            }}
            placeholder={
              !isConnected ? "Connecting..." : "Type your message..."
            }
            disabled={!isConnected}
            rows={1}
            style={{ resize: "none" }}
            className="border-border focus:ring-primary bg-border max-h-[150px] min-h-[36px] flex-1 overflow-y-auto rounded-lg border px-3 py-1.5 text-xs placeholder:text-xs focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:max-h-[200px] sm:min-h-[40px] sm:px-4 sm:py-2 sm:text-sm sm:placeholder:text-sm"
          />
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50 flex h-[36px] items-center gap-1 rounded-lg px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:h-[40px] sm:gap-2 sm:px-7"
            onClick={handleSendMessageWithScroll}
            disabled={!message?.text?.trim() || !isConnected}
          >
            <SendIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {!isConnected && (
          <div className="mx-auto mt-2 max-w-6xl">
            <p className="text-muted-foreground text-center text-xs">
              Reconnecting to chat...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Utility function for debouncing scroll events
function debounce<T extends (...args: unknown[]) => ReturnType<T>>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default ChatContainer;
