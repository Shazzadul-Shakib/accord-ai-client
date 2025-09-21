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
    isSummaryLoading,
    chatSummary,
    handleGenerateSummary,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [scrollPositionBeforeLoad, setScrollPositionBeforeLoad] = useState<{
    scrollTop: number;
    scrollHeight: number;
  } | null>(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // Threshold for determining if user is near bottom (in pixels)
  const SCROLL_THRESHOLD = 150;

  // Check if user is near bottom of chat
  const checkIfNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= SCROLL_THRESHOLD;
  }, []);

  // Improved scroll to bottom function
  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth", force = false) => {
      const container = containerRef.current;
      const bottom = bottomRef.current;

      if (!container || !bottom) return;

      try {
        // Use scrollIntoView on bottom element
        bottom.scrollIntoView({
          behavior,
          block: "end",
          inline: "nearest",
        });

        // Fallback for reliability
        if (force || behavior === "instant") {
          const scrollToMax = () => {
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          };

          setTimeout(scrollToMax, 10);
          setTimeout(scrollToMax, 50);
        }
      } catch (error) {
        console.warn("ScrollIntoView failed, using fallback:", error);
        container.scrollTop = container.scrollHeight;
      }
    },
    [],
  );

  // Handle scroll events with improved user intent detection
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop } = container;
    const nearBottom = checkIfNearBottom();
    const wasNearBottom = isUserNearBottom;

    // Detect if user manually scrolled up (not programmatic scroll)
    const scrolledUp = scrollTop < lastScrollTop && !nearBottom;
    const scrolledDown = scrollTop > lastScrollTop;

    setIsUserNearBottom(nearBottom);
    setLastScrollTop(scrollTop);

    // Only set userScrolledUp if it was a significant manual scroll up
    if (
      scrolledUp &&
      !isInitialLoad &&
      Math.abs(scrollTop - lastScrollTop) > 50
    ) {
      setUserScrolledUp(true);
    }

    // Reset scroll intent if user manually scrolls near bottom
    if (scrolledDown && nearBottom && userScrolledUp) {
      setUserScrolledUp(false);
    }

    // Load more messages when scrolling near top
    if (
      container.scrollTop < 200 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isInitialLoad
    ) {
      setScrollPositionBeforeLoad({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      });
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    checkIfNearBottom,
    isInitialLoad,
    isUserNearBottom,
    userScrolledUp,
    lastScrollTop,
  ]);

  // Debounced scroll handler
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

    if (!container || !scrollPositionBeforeLoad || isFetchingNextPage) return;

    const restoreScrollPosition = () => {
      if (container && scrollPositionBeforeLoad) {
        const heightDifference =
          container.scrollHeight - scrollPositionBeforeLoad.scrollHeight;
        if (heightDifference > 0) {
          const newScrollTop =
            scrollPositionBeforeLoad.scrollTop + heightDifference;
          container.scrollTop = newScrollTop;
          setLastScrollTop(newScrollTop);

          const { scrollTop, scrollHeight, clientHeight } = container;
          const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
          setIsUserNearBottom(distanceFromBottom <= SCROLL_THRESHOLD);
        }
        setScrollPositionBeforeLoad(null);
      }
    };

    const rafId = requestAnimationFrame(() => {
      restoreScrollPosition();
    });

    return () => cancelAnimationFrame(rafId);
  }, [isFetchingNextPage, scrollPositionBeforeLoad, SCROLL_THRESHOLD]);

  // Effect for initial load
  useEffect(() => {
    if (!isChatMessagesLoading && messages?.messages && isInitialLoad) {
      setIsInitialLoad(false);
      setShouldScrollToBottom(true);
      setUserScrolledUp(false); // Reset on initial load
      setTimeout(() => scrollToBottom("instant", true), 100);
    }
  }, [isChatMessagesLoading, messages, isInitialLoad, scrollToBottom]);

  // FIXED: Enhanced effect for new messages with better auto-scroll logic
  useEffect(() => {
    if (!messages?.messages || isFetchingNextPage || isInitialLoad) return;

    const currentMessageCount = messages.messages.length;

    // Only process if we have new messages (not from loading older messages)
    if (currentMessageCount > lastMessageCount) {
      const newMessagesCount = currentMessageCount - lastMessageCount;
      const latestMessages = messages.messages.slice(-newMessagesCount);

      // Check if any new message is from current user
      const hasUserMessage = latestMessages.some((msg) => msg.sender === user);

      // IMPROVED AUTO-SCROLL LOGIC:
      const shouldAutoScroll =
        hasUserMessage || // Always scroll for user's own messages
        !userScrolledUp || // Scroll if user hasn't intentionally scrolled up
        isUserNearBottom; // Scroll if user is still near bottom

      if (shouldAutoScroll) {
        setShouldScrollToBottom(true);

        // Reset scroll intent when showing new messages
        if (hasUserMessage) {
          setUserScrolledUp(false);
        }
      }

      // Update message count
      setLastMessageCount(currentMessageCount);
    }
  }, [
    messages?.messages,
    lastMessageCount,
    user,
    isUserNearBottom,
    userScrolledUp,
    isInitialLoad,
    isFetchingNextPage,
  ]);

  // Effect for scrolling to bottom with multiple attempts for reliability
  useEffect(() => {
    if (shouldScrollToBottom && containerRef.current) {
      const timeouts: NodeJS.Timeout[] = [];

      // Immediate scroll
      scrollToBottom("smooth");

      // Multiple delayed attempts for reliability
      [50, 100, 200, 300].forEach((delay) => {
        const timeout = setTimeout(() => {
          if (containerRef.current) {
            scrollToBottom("smooth");
          }
        }, delay);
        timeouts.push(timeout);
      });

      setShouldScrollToBottom(false);

      return () => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
      };
    }
  }, [shouldScrollToBottom, scrollToBottom]);

  // Effect for typing indicator
  useEffect(() => {
    if (isTyping && (isUserNearBottom || !userScrolledUp)) {
      scrollToBottom("smooth");
    }
  }, [isTyping, isUserNearBottom, userScrolledUp, scrollToBottom]);

  // Handle sending message with immediate scroll
  const handleSendMessageWithScroll = useCallback(() => {
    handleSendMessage();
    setShouldScrollToBottom(true);
    setUserScrolledUp(false); // Reset scroll intent when user sends message

    // Force immediate scroll for user messages
    setTimeout(() => scrollToBottom("smooth", true), 10);
    setTimeout(() => scrollToBottom("smooth", true), 100);
  }, [handleSendMessage, scrollToBottom]);

  // Scroll to bottom button handler
  const handleScrollToBottomClick = useCallback(() => {
    setShouldScrollToBottom(true);
    setIsUserNearBottom(true);
    setUserScrolledUp(false);

    scrollToBottom("smooth", true);
    setTimeout(() => scrollToBottom("smooth", true), 50);
    setTimeout(() => scrollToBottom("instant", true), 100);
  }, [scrollToBottom]);

  // Reset scroll state when chat changes
  useEffect(() => {
    if (selectedChatId) {
      setIsInitialLoad(true);
      setShouldScrollToBottom(true);
      setIsUserNearBottom(true);
      setUserScrolledUp(false);
      setLastMessageCount(0);
      setScrollPositionBeforeLoad(null);
      setLastScrollTop(0);
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
                      className="bg-primary flex cursor-pointer items-center rounded-md px-2 py-1.5 sm:px-3 sm:text-sm"
                      onClick={handleGenerateSummary}
                    >
                      <WandSparkles className="h-4 w-4 sm:h-6 sm:w-6" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate Summary</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle> AI Generated Chat Summary</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {isSummaryLoading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="bg-border h-4 w-3/4 rounded"></div>
                      <div className="bg-border h-4 w-1/2 rounded"></div>
                    </div>
                  ) : summary ? (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">Title</h3>
                        <p className="text-muted-foreground text-sm">
                          {summary.title}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Description</h3>
                        <p className="text-muted-foreground text-sm">
                          {summary.description}
                        </p>
                      </div>
                      {summary.conclusions?.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium">Key Conclusions</h3>
                          <ul className="text-muted-foreground list-inside list-disc text-sm">
                            {summary.conclusions.map(
                              (conclusion: string, i: number) => (
                                <li key={i}>{conclusion}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                      {summary.points?.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium">Key Points</h3>
                          <ul className="text-muted-foreground list-inside list-disc text-sm">
                            {summary.points.map(
                              (p: { event: string }, i: number) => (
                                <li key={i}>{p.event}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No summary available
                    </p>
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
              onClick={handleScrollToBottomClick}
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
