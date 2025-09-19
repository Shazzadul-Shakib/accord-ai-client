import { authApi } from "@/tanstack/api-services/authApi";
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

  // get all users
  const {
    isPending: isAllUsersLoading,
    data: allUsers,
  } = useQuery({
    queryKey: ["users","user"],
    queryFn: authApi.allUsers,
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
    allUsers,
    isAllUsersLoading,
  };
};
