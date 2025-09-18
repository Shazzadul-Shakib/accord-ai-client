import { chatApi } from "@/tanstack/api-services/chatApi";
import { useQuery } from "@tanstack/react-query";

export const useSidebar = () => {
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

  return { isChatListLoading, chatList, IsChatListError, chatListError };
};
