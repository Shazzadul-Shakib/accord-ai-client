import { Suspense } from "react";
import ChatContaineer from "./(ui)/chat-container";
import ChatContainerSkeleton from "./(ui)/skeletonss/chat-container-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<ChatContainerSkeleton />}>
      <ChatContaineer />
    </Suspense>
  );
}
