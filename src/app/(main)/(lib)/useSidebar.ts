import { chatApi } from "@/tanstack/api-services/chatApi";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export const useSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedChatId = searchParams.get("chat");
  // get logged users ChatLists
  const {
    isPending: isChatListLoading,
    data: chatList,
    isError: IsChatListError,
    error: chatListError,
  } = useQuery({
    queryKey: ["chat"],
    queryFn: chatApi.chatList,
  });

  const handleChatSelect = (chatId: string) => {
    router.push(`?chat=${chatId}`);
  };

  return {
    isChatListLoading,
    chatList,
    IsChatListError,
    chatListError,
    handleChatSelect,
    selectedChatId,
  };
};
